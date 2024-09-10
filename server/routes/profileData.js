import express from 'express'

// for Database connectivity
import connectMongo from "../server.js";
import { ObjectId } from "mongodb";

const router = express.Router()


router.get('/', async (req, res)=> {
   const {user} = req.query // The user to find

   // connection to the users collection in the db
   const database = await connectMongo()
   const usersCollection = database.collection("Users")
   const mainFeedCollection = database.collection("mainFeed")

   /*
      * Finding the user in the db based off of the query string
    */

   const userPosts = await mainFeedCollection.find(
      {poster: user},
   ).toArray()


   res.json(userPosts)

})




export default router