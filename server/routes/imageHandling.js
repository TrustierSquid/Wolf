import dotenv from "dotenv";
dotenv.config();
import express from "express";
// To check if the user has a token for accessing certain routes
import requireAuth from "../middleware/authMiddleware.js";
import connectMongo from "../server.js";
import crypto from 'crypto'
import { GridFSBucket } from "mongodb";


const router = express.Router()




router.post('/', (req, res)=> {

})




export default router