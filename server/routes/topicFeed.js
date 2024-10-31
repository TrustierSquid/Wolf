import express from 'express'

// for Database connectivity
import connectMongo from "../server.js";

const router = express.Router()

// Grabing the posts based off of what topic was clicked on
router.get('/', async (req, res)=> {
   const {topicFeed} = req.query

   const database = await connectMongo()
   const feed = database.collection(topicFeed)

   const posts = await feed.find({}).toArray()

   // console.log(posts)

   const responsePost = posts.map(post => ({
      _id: post._id,
      poster: post.poster,
      subject: post.subject,
      body: post.body,
      likes: post.likes,
      postCreationDate: post.postCreationDate,
      comments: post.comments,
      image: post.image ? `data:${post.image.contentType};base64,${post.image.data.toString('base64')}` : null
    }))

    // res.json({ reversedPosts: posts.reverse() });
    res.json({ reversedPosts: responsePost.reverse() });

})


export default router