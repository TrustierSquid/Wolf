import express from 'express'

// for Database connectivity
import connectMongo from "../server.js";
import { ObjectId } from "mongodb";

const router = express.Router()


// This route gets executed when the page reloads
router.get("/", async (req, res) => {
   //  this is the topicFeed that the user selects off the grid
   const {topic} = req.query

   //  if there is no topic feed then it defaults to the mainFeed
   if (!topic) {
     const database = await connectMongo();
     const mainFeed = database.collection("mainFeed");
     const documents = await mainFeed.find({}).toArray();

     // returns each document (newest first)
     const allPosts = documents.map((document) => {
       return {
         ...document,
       };
     });

     const reversedPosts = allPosts.reverse();

     res.json({ reversedPosts });

   } else {

     // return whatever topicFeed that was selected
     const database = await connectMongo();
     const customFeed = database.collection(`${topic}Feed`);
     const documents = await customFeed.find({}).toArray();

     // returns each document (newest first)
     const allPosts = documents.map((document) => {
       return {
         ...document,
       };
     });

     // sends post from newest first
     const reversedPosts = allPosts.reverse();
     console.log(`Showing posts for ${topic}`)
     res.json({ reversedPosts });

   }

 });


router.get('/sports', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`SportsFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const sportsFeed = allPosts.reverse();
   res.json({ sportsFeed });
})

router.get('/cosmetology', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`CosmetologyFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const cosmetologyFeed = allPosts.reverse();
   res.json({ cosmetologyFeed });
})

router.get('/food', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`FoodFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const foodFeed = allPosts.reverse();
   res.json({ foodFeed });
})

router.get('/selfcare', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`Self careFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const selfcareFeed = allPosts.reverse();
   res.json({ selfcareFeed });
})

router.get('/goalsetting', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`Goal settingFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const goalsettingFeed = allPosts.reverse();
   res.json({ goalsettingFeed });
})

router.get('/tech', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`TechFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const techFeed = allPosts.reverse();
   res.json({ techFeed });
})

router.get('/movies', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`MoviesFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const MoviesFeed = allPosts.reverse();
   res.json({ MoviesFeed });
})

router.get('/tv', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`TVFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const TVFeed = allPosts.reverse();
   res.json({ TVFeed });
})

router.get('/reading', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`ReadingFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const readingFeed = allPosts.reverse();
   res.json({ readingFeed });
})

router.get('/filmmaking', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`FimmakingFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const filmmakingFeed = allPosts.reverse();
   res.json({ filmmakingFeed });
})

router.get('/diy', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`DIY ProjectsFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const diyFeed = allPosts.reverse();
   res.json({ diyFeed });
})

router.get('/dating', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`DatingFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const datingFeed = allPosts.reverse();
   res.json({ datingFeed });
})

router.get('/makeup', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`Makeup TutorialsFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const makeupFeed = allPosts.reverse();
   res.json({ makeupFeed });
})

router.get('/programming', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`ProgrammingFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const programmingFeed = allPosts.reverse();
   res.json({ programmingFeed });
})

router.get('/lifehacks', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`Life hacksFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const lifehacksFeed = allPosts.reverse();
   res.json({ lifehacksFeed });
})

router.get('/software', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`SoftwareFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const softwareFeed = allPosts.reverse();
   res.json({ softwareFeed });
})

router.get('/computer', async (req, res)=> {
   // return whatever topicFeed that was selected
   const database = await connectMongo();
   const customFeed = database.collection(`ComputerFeed`);
   const documents = await customFeed.find({}).toArray();

   // returns each document (newest first)
   const allPosts = documents.map((document) => {
     return {
       ...document,
     };
   });

   // sends post from newest first
   const computerFeed = allPosts.reverse();
   res.json({ computerFeed });
})







export default router