import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";

// IMPORTING ROUTES
import signinRoutes from "./routes/signin.js";
import profileRoutes from "./routes/profileData.js";
import topicFeedRoutes from "./routes/topicFeed.js";

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

// CORS
app.use(cors());

// MIDDLEWARE
app.use(cookieParser());
app.use(express.json());
// app.use(express.static(path.join(__dirname,  "./dist")));

app.use("/users", signinRoutes);
app.use("/profileData", profileRoutes);
app.use("/loadTopicFeed", topicFeedRoutes);
// app.use('/userInteraction', likesRoutes)

// Creating new mongoClient instance
const uri = process.env.DB_URI;
const currentDate = new Date();

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

// if the user enters any file extension they will be redirected to login again
// for prod
app.get("/home.html", requireAuth, (req, res) => {
  res.redirect("/");
  console.log("Cant do that, going back to home");
});

app.get("/topics.html", requireAuth, (req, res) => {
  res.redirect("/");
  console.log("Cant do that, going back to home");
});

app.get("/index.html", requireAuth, (req, res) => {
  res.redirect("/");
  console.log("Cant do that, going back to home");
});

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
app.get("/user", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/topics.html"));
});

/* HOME FEED PAGE */

app.get("/home", requireAuth, (req, res) => {
  // for dev
  res.sendFile(path.join(__dirname, "/dist/home.html"));
});

app.get("/viewProf", (req, res) => {
  res.sendFile(path.join(__dirname, "../profile.html"));
});

app.get("/wolfTopics", (req, res) => {
  res.json(topicFacts);
});

// ROUTE EXECUTES WHEN THE USER WANTS TO LOOK AT THEIR OWN PROFILE
app.post("/profile", (req, res) => {
  const { username } = req.body;
  console.log(`${username} wants to look at his profile!`);
});




// Sends the current list of posts in the mainFeed
app.get("/update", async (req, res) => {
  const database = await connectMongo();
  const mainFeedCollection = database.collection("mainFeed");

  const posts = await mainFeedCollection.find({}).toArray();

  res.json({ reversedPosts: posts.reverse() });
});




// ROUTE EXECUTES WHEN THE USER CREATES A NEW POST
app.post("/newPost", async (req, res) => {
  const { feed } = req.query;

  // if no feed is selected, post will default to mainFeed
  if (feed === "mainFeed") {
    // retrieving the username, and post details (subject, body)
    const { whoPosted, postSubject, postBody } = req.body;

    console.log(`${whoPosted} just posted! \n ${postSubject} \n ${postBody}`);

    // Updating the poster's post count
    let database = await connectMongo();
    const users = database.collection("Users");
    const mainFeed = database.collection("mainFeed");

    // poster
    const filter = { user: whoPosted };
    const updateDoc = {
      $inc: {
        posts: 1,
      },
    };

    const updatePosts = await users.updateOne(filter, updateDoc);

    // adding the post to the DB
    const newPost = mainFeed.insertOne({
      poster: whoPosted,
      subject: postSubject,
      body: postBody,
      likes: [],
      postCreationDate: new Date(),
    });

    // Adding the post to the database will lead to a call to action on the frontend
    // The frontend will load this collection in the database to show the user feed

    res.json({ message: "Posted Successfully" });
  } else {
    // retrieving the username, and post details (subject, body)
    const { whoPosted, postSubject, postBody } = req.body;

    console.log(
      `${whoPosted} just posted in ${feed}! \n ${postSubject} \n ${postBody}`
    );

    // Updating the poster's post count
    let database = await connectMongo();
    const users = database.collection("Users");
    const selectedFeed = database.collection(feed);

    // poster
    const filter = { user: whoPosted };
    const updateDoc = {
      $inc: {
        posts: 1,
      },
    };

    const updatePosts = await users.updateOne(filter, updateDoc);

    // adding the post to the DB
    const newPost = selectedFeed.insertOne({
      poster: whoPosted,
      subject: postSubject,
      body: postBody,
      likes: [],
      postCreationDate: new Date(),
    });

    // Adding the post to the database will lead to a call to action on the frontend
    // The frontend will load this collection in the database to show the user feed

    res.json({ message: `Posted Successfully to ${feed}Feed` });
  }
});




let latestLikeCounter = null;

app.post("/addLike", requireAuth, async (req, res) => {
  const { postID, loggedInUser } = req.body;
  const { feed } = req.query;

  const database = await connectMongo();

  //  By default, will look through the posts on the mainfeed
  if (feed === "mainFeed") {
    const posts = database.collection("mainFeed");

    // Find a duplicate user
    let findDuplicateUser = await posts.findOne({
      _id: new ObjectId(postID),
      likes: { $in: [loggedInUser] },
    });

    // If the user is already liking a post, then they will be removed from the array

    if (findDuplicateUser) {
      await posts.updateOne(
        { _id: new ObjectId(postID) },
        { $pull: { likes: loggedInUser } }
      );
      console.log(
        `removed ${loggedInUser}'s like ${findDuplicateUser.poster}s post`
      );
      res.json({ latestLikeCounter });
    } else {
      await posts.updateOne(
        { _id: new ObjectId(postID) },
        { $push: { likes: loggedInUser } }
      );

      console.log(`${loggedInUser} liked a post`);
      res.json({ latestLikeCounter });
    }
  } else {
    const posts = database.collection(feed);

    // Find a duplicate user
    let findDuplicateUser = await posts.findOne({
      _id: new ObjectId(postID),
      likes: { $in: [loggedInUser] },
    });

    // If the user is already liking a post, then they will be removed from the array

    if (findDuplicateUser) {
      await posts.updateOne(
        { _id: new ObjectId(postID) },
        { $pull: { likes: loggedInUser } }
      );
      console.log(
        `removed ${loggedInUser}'s like ${findDuplicateUser.poster}s post`
      );
      res.json({ latestLikeCounter });
    } else {
      await posts.updateOne(
        { _id: new ObjectId(postID) },
        { $push: { likes: loggedInUser } }
      );

      console.log(`${loggedInUser} liked a post`);
      res.json({ latestLikeCounter });
    }
  }
});



app.post("/postLikeCounter", async (req, res) => {
  const { postID } = req.body;

  const database = await connectMongo();
  const posts = database.collection("mainFeed");

  let post = await posts.findOne({ _id: new ObjectId(postID) });

  let postLikes = post.likes.length;

  res.json(postLikes);
});



// checking who the logged in user is following
app.get("/checkUser/following", requireAuth, async (req, res) => {
  const loggedInUserId = req.currentUser;

  // connecting to the db
  const database = await connectMongo();
  const users = database.collection("Users");

  try {
    // finding and checking to see if the user exists
    const user = await users.findOne({ _id: new ObjectId(loggedInUserId) });
    if (!user) return res.status(404).json({ message: "Could not find user!" });

    res.json(user.following);
  } catch {
    console.log("Operation failed");
  }
});



// Handling user following
// add a followee to the logged in users following list
app.post("/addFollowingUser", async (req, res) => {
  const { followee, loggedInUser } = req.body;

  // connecting to the db
  const database = await connectMongo();
  const users = database.collection("Users");

  // checks to see if a user is already a follower of a user
  const duplicateUserFollowing = await users.findOne({
    user: loggedInUser,
    following: { $in: [followee] },
  });
  const duplicateUserFollower = await users.findOne({
    user: followee,
    followers: { $in: [loggedInUser] },
  });

  if (duplicateUserFollowing || duplicateUserFollower) {
    console.log(`${loggedInUser} unfollows  ${followee}`);
    try {
      // updating current users following list
      await users.updateOne(
        { user: loggedInUser },
        { $pull: { following: followee } }
      );

      // updating followee list
      await users.updateOne(
        { user: followee },
        { $pull: { followers: loggedInUser } }
      );
    } catch {
      console.log("Unable to complete the follow transaction");
    }
  } else {
    try {
      // updating current users following list
      await users.updateOne(
        { user: loggedInUser },
        { $addToSet: { following: followee } }
      );

      // updating followee list
      await users.updateOne(
        { user: followee },
        { $addToSet: { followers: loggedInUser } }
      );

      console.log(`${loggedInUser} is now following ${followee}`);
    } catch {
      console.log("Unable to complete the follow transaction");
    }
  }
});

app.listen(port, () => {
  console.clear();
  console.log(`Server running on port ${port}`);
  console.log(currentDate);
});

export default connectMongo;
