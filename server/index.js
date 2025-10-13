import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();

const app=express();
app.use(express.json());
app.use(cors());

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

connectDB();