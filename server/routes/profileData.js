import express from "express";

// for Database connectivity
import connectMongo from "../server.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  const { user, feed } = req.query; // The user to find

  // connection to the users collection in the db
  const database = await connectMongo();
  const usersCollection = database.collection("Users");

  // dynamic feed based on what was in the dropdown of the user profile
  const feedCollection = database.collection(feed);

  /*
   * Finding the user in the db based off of the query string
   */

  // finds the user based of their uid
  const userData = await usersCollection.findOne({ UID: user });

  // finds the posts of the selected user
  const userPosts = await feedCollection.find({ poster: userData.user }).toArray();


  res.json({
    // posts from the mainfeed
    profilePostData: userPosts,

    // profile data based on the query string
    userData: userData,
  });
});

router.get("/getID", async (req, res) => {
  const { poster } = req.query;
  console.log(poster);

  const database = await connectMongo();
  const users = database.collection("Users");

  const foundUser = await users.findOne({ user: poster });

  res.json({ userUID: foundUser.UID });

  console.log(`Here is the found users UID ${foundUser.UID}`);
});

export default router;
