import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js";
import { NonRetriableError } from "inngest";
import analyzeTicket from "../../utils/ai.js";

export const onTicketCreate=inngest.createFunction(
    {id:'on-ticket-created',retries:3},
    {event:"ticket/created"},

    async({event,step})=>{
        try {
              const {ticketId}=event.data

              // fetch ticket from db
              const ticket=await step.run("fetch-ticket",async()=>{
                 const ticketObject=await Ticket.findById(ticketId)
                    if(!ticketObject){
                       throw new NonRetriableError("Ticket not found")
                    }
                    return ticketObject
              })
                  
              await step.run("update-ticket-info",async()=>{
                 await Ticket.findByIdAndUpdate(ticket._id,{status:"TODO"})
              })

               
              const aiResponse=await analyzeTicket(ticket)

             const relatedskills= await step.run("ai-processing",async()=>{
                  let skills=[]
                  if(aiResponse){
                    await Ticket.findByIdAndUpdate(ticket,_id,{
                        priority:!["low","medium","high"].includes(aiResponse.priority) ? "medium":aiResponse.priority,
                        helpfulNotes:aiResponse.helpfulNotes,
                        status:"IN_PROGRESS",
                        relatedSkills:aiResponse.relatedSkills
                    })
                    skills=aiResponse.relatedSkils
                  }
                  return skills
              })
        } catch (error) {
            
        }
    }
)