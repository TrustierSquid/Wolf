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

// establishing a connection to mongodb
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

// Getting the list of topic that the user can choose from
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


app.listen(port, async () => {
  console.clear();
  console.log(`Server is running on port ${port}`);
});

export default connectMongo;
