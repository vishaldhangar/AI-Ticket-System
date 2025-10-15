import express from 'express';
import { getUsers, login, logout, signup, UpdateUser } from '../controllers/user.js';
import { authenticate } from '../middleware/auth.js';

const route=express.Router();

route.post('/signup',signup)
route.post('/login',login)
route.post('/logout',logout)
route.post('/updateUser',authenticate,UpdateUser)
route.post('/users',authenticate,getUsers)

export default route;