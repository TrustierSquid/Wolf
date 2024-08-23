import express from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";

// IMPORTING ROUTES
import signinRoutes from "./routes/signin.js";

// To check if the user has a token for accessing certain routes
import requireAuth from "./middleware/authMiddleware.js";

// MONGODB
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

// list of topics for the user to choose from
import topics from "./json/topics.json" assert { type: "json" };

// A fact that comes with each topic
import topicFacts from "./json/facts.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// express server setup
const app = express();
const port = process.env.PORT;

// Creating new mongoClient instance
const uri = process.env.DB_URI;

// CORS
app.use(cors());

// MIDDLEWARE
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname,  "../dist")));
app.use("/users", signinRoutes);

// if the user enters any file extension they will be redirected to login again
app.get("/home.html", (req, res) => {
  res.redirect("/");
});

app.get("/user.html", (req, res) => {
  res.redirect("/");
});

app.get("/index.html", (req, res) => {
  res.redirect("/");
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

//  ESTABLISHING CONNECTION TO MONGODB
async function connectMongo() {
  if (database) return database;

  try {
    await client.connect();
    database = client.db(process.env.DB_NAME);
    console.log("Connected to MongoDB!");
    return database;
  } catch (err) {
    console.log("Error connecting to MongoDB!");
  }
}

connectMongo();

// on load Send user to login screen
app.get("/", (req, res) => {
  // for dev
  console.log("User connected to login page");
  // res.send('<h1>Login page</h1>')
  res.sendFile(path.join(__dirname, "index.html"));
});

/* TOPICS PAGE*/

// Retrieving the list of topics that the user can choose from
app.get("/api/topics", (req, res) => {
  res.json(topics);
});

// to get to the topics page!
app.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname, "user.html"));
});

/* HOME FEED PAGE */

app.get("/home", requireAuth, (req, res) => {
  // for dev
  res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/wolfTopics", (req, res) => {
  res.json(topicFacts);
});

// ROUTE EXECUTES WHEN THE USER WANTS TO LOOK AT THEIR OWN PROFILE
app.post("/profile", (req, res) => {
  const { username } = req.body;
  console.log(`${username} wants to look at his profile!`);
});

// ROUTE EXECUTES WHEN THE USER CREATES A NEW POST
app.post("/newPost", async (req, res) => {
  // retrieving the username, and post details (subject, body)
  const { whoPosted, postSubject, postBody } = req.body;

  console.log(`${whoPosted} just posted! \n ${postSubject} \n ${postBody}`);

  // Updating the poster's post count
  let database = await connectMongo();
  const users = database.collection("Users");
  const posts = database.collection("Posts");

  // poster
  const filter = { user: whoPosted };
  const updateDoc = {
    $inc: {
      posts: 1,
    },
  };

  const updatePosts = await users.updateOne(filter, updateDoc);

  // adding the post to the DB
  const newPost = posts.insertOne({
    poster: whoPosted,
    subject: postSubject,
    body: postBody,
  });

  res.json({ message: "Posted Successfully" });
});

// Updating the users feed
app.get("/update", async (req, res) => {
  const database = await connectMongo();
  const posts = database.collection("Posts");

  const documents = await posts.find({}).toArray();

  const allPosts = documents.map((document) => {
    return {
      ...document,
    };
  });

  // sends post from newest first
  const reversedPosts = allPosts.reverse();

  res.json({ reversedPosts });
});

// Dummy Route
app.get("/tester", (req, res) => {
  res.send("<h1>Made it!</h1>");
});

app.listen(port, () => {
  console.clear();
  console.log(`Server is running on port ${port}`);
});

export default connectMongo;
