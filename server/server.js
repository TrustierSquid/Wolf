import express from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// IMPORTING ROUTES

// returns newUser identity
import signinRoutes from "./routes/signin.js";

import requireAuth from "./middleware/authMiddleware.js";
import cookieParser from "cookie-parser";

// mongoDB
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

// list of topics for the user to choose from
import topics from "./json/topics.json" assert { type: "json" };
import topicFacts from "./json/facts.json" assert {type: 'json'}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT;

// express server setup
const app = express();

// Creating new mongoClient instance
const uri = process.env.DB_URI;

// MIDDLEWARE
app.use(express.static(path.join(__dirname, 'dist')));


app.use(cors())
app.use(cookieParser());
app.use(express.json());

// IMPORTED ROUTES
app.use("/users", signinRoutes);

app.use((req, res, next) => {
   // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  if (req.url.endsWith(".jsx")) {
    res.setHeader("Content-Type", "application/javascript");
  }
  next();
});

// database configuration
let database = null;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

/* 

  ESTABLISHING CONNECTION TO MONGODB

 */

async function connectMongo() {
  if (database) return database;

  try {
    await client.connect();
    database = client.db(process.env.DB_NAME);
    console.log("Connected to MongoDB");
    return database;
  } catch (err) {
    console.log("Error connecting to MongoDB");
  }
}

connectMongo();

// on load Send user to login screen
app.get("/", (req, res) => {
  // for dev
  res.sendFile(path.join(__dirname, '../', 'index.html'))

  // for prod
  // res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  console.log("User arrived at login screen");
});


/* 


 TOPICS PAGE


 */


// Retrieving the list of topics that the user can choose from
app.get("/api/topics", (req, res) => {
  res.json(topics);
});

// to get to the topics page!
app.get("/user", requireAuth, (req, res) => {   
  // for dev
  res.sendFile(path.join(__dirname, '../', 'user.html'))

  // for prod
  // res.sendFile(path.join(__dirname, 'dist', 'user.html'))
  console.log("User arrived at user page");
});


/* 


HOME FEED PAGE


*/

app.get('/home', requireAuth, (req, res)=> {
  // for dev
  res.sendFile(path.join(__dirname, '../', 'home.html'))
  
  // for prod
  // res.sendFile(path.join(__dirname, 'dist', 'home.html'))
  console.log("User arrived at user page");
})

app.get('/wolfTopics', (req, res)=> {
  res.json(topicFacts)
})


/* 

  HOME PAGE USER ANALYTICS

 */


// Route executes when a user likes a post
app.post('/like', requireAuth, async (req, res)=> {
  // info gathered based on the individual post that was liked
  const {likeCheck, whoLiked, poster} = req.body
  const database = await connectMongo()
  const users = database.collection('Users')

  // poster
  const filter = {user: poster}
  const updateDoc = {
    $inc: {
      totalLikes: 1
    }
  }
  
  const updatePosterTotalLikes = await users.updateOne(filter, updateDoc)
  const findPoster = await users.findOne({user: poster})

  if(updatePosterTotalLikes) {
    console.log(`${whoLiked} liked ${findPoster.user}'s post! ${findPoster.user} has ${findPoster.totalLikes} likes`)    
    res.json({totalLikes: findPoster.totalLikes})
  } else {
    console.log(`couldnt find the poster in the database`)
  }
  
  
})


// ROUTE EXECUTES WHEN THE USER WANTS TO LOOK AT THEIR OWN PROFILE
app.post('/profile',  (req, res)=> {
  const {username} = req.body
  console.log(`${username} wants to look at his profile!`)
  
})


// ROUTE EXECUTES WHEN THE USER CREATES A NEW POST
app.post('/newPost', async (req, res)=> {
  // retrieving the username, and post details (subject, body)
  const {whoPosted, postSubject, postBody} = req.body;

  console.log(`${whoPosted} just posted! \n ${postSubject} \n ${postBody}`)

  // Updating the poster's post count
  let database = await connectMongo()
  const users = database.collection('Users')
  const posts = database.collection('Posts')
  
  // poster
  const filter = {user: whoPosted}
  const updateDoc = {
    $inc: {
      posts: 1
    }
  }

  const updatePosts = await users.updateOne(filter, updateDoc)
  
  // adding the post to the DB
  const newPost = posts.insertOne({
    poster: whoPosted,
    subject: postSubject,
    body: postBody
  })
  

  res.json({message: 'Posted Successfully'})
})


app.get('/update', async (req, res)=> {

  const database = await connectMongo()
  const posts = database.collection('Posts')

  const documents = await posts.find({}).toArray();

  const allPosts = documents.map(document => {
    return {
      ...document,
    }
  })

  res.json({allPosts})
  
})









app.listen(port, async () => {
  console.clear();
  console.log(`Server is running on port ${port}`);
});

export default connectMongo;
