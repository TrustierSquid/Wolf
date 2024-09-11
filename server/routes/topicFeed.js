import express from 'express'

// for Database connectivity
import connectMongo from "../server.js";

const router = express.Router()

// Grabing the posts based off of what topic was clicked on
router.get('/', async (req, res)=> {
   const {topicFeed} = req.query
   console.log(`Showing a different Feed ${topicFeed}`)

   const database = await connectMongo()
   const feed = database.collection(topicFeed)

   const posts = await feed.find({}).toArray()

   // console.log(posts)

   res.json({reversedPosts: posts.reverse()})
})


export default router