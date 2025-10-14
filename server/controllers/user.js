import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import {inngest} from '../inngest/client.js'

export const signup=async()=>{
    const {email,password,skills=[]}=req.body;
    try {
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=await User.create({email,password:hashedPassword,skills}) 


        // fire inngest event
        await inngest.send({
            name:"user/signup",
            data:{
                email
            }
        })

        const token=jwt.sign({_id:newUser._id,role:newUser.role},process.env.SECRET_KEY)
        res.json({user:newUser,token})
    } catch (error) {
       res.status(500).json({error:"SignUp failed",details:error.message})
    }
}


export const login=async(req,res)=>{
    const {email,password}=req.body;
    
     try {
        const user=await User.findOne({email});
        if(!user) return res.status(404).json({error:"User not found"})

        const matchPassword=await bcrypt.compare(password,user.password);
        if(!matchPassword) return res.status(401).json({error:"invalid Credentials"})

        const token=jwt.sign({_id:user._id,role:user.role},process.env.SECRET_KEY)
        res.json({user,token})

    } catch (error) {
        res.status(500).json({error:"Login failed",details:error.message})
    }
}


export const logout=async(req,res)=>{
    try {
         const token=req.headers.authorization.split(" ")[1];
         if(!token) return res.status(401).json({error:"Unauthorized"})
            jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
                if(err) return res.status(401).json({error:"Invalid Token"})
            })
    } catch (error) {
        res.status(500).json({error:"Logout failed",details:error.message})
    }
}