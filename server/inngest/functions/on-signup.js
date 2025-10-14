import { inngest } from "../client.js";
import User from "../../models/user.js"
import { NonRetriableError } from "inngest";

export const onSignup=inngest.createFunction(
    {id:'on-user-signup',retries:3},
    {event:"user/signup"},
    async({event,step})=>{
         try {
            const {email}=event.data
           const user= await step.run("get-user-email",async()=>{
            const userObject=await User.findOne({email})
            if(!userObject){
                throw new NonRetriableError("User no longer exists in our database")
            }
            return userObject
        })

             await step.run("send-welcome-email",async()=>{
                const subject =`Welcome to the app`
                const message=`Hi,
                /n/n
                Thanks for signing up.. we are glad to have you onboard!
                `
                await SendmailTransport(user.email,subject ,message)
             })  
           return {success:true}
         } catch (error) {
           console.log("Error occurred during signup:", error.message);
           return {success:false}
         }
    }
);