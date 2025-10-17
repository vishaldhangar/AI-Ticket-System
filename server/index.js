import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import route from './routes/user.js';
import ticketRoutes from "./routes/ticket.js";
import { inngest } from "./inngest/client.js";
import { onSignup } from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";
import { serve } from "inngest/express";

dotenv.config();

const app=express();
app.use(express.json());
app.use(cors()); 

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onSignup, onTicketCreated],
  })
);


const PORT=process.env.PORT || 4000;
const MONGO=process.env.MONGO_URI;

const connectDB=async()=>{
    try {
        await mongoose.connect(MONGO);
        console.log("Database connected successfully");
        
        app.listen(PORT,()=>{
          console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error("Database connection failed",error);
    }
}

app.use('/api/auth',route)
app.use("/api/tickets", ticketRoutes);

connectDB();