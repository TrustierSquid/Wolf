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

  // finds the user based off their uid
  const userData = await usersCollection.findOne({ UID: user });

  if (!userData) {
    // Handle the case where no user is found
    return res.status(404).json({ message: "User not found" });
  }

  const userDataModified = {
    user: userData.user,
    password: userData.password,
    UID: userData.UID,
    followers: userData.followers,
    following: userData.following,
    posts: userData.posts,
    topics: userData.topics,
    created: userData.created,
    userBio: userData.userBio,
    profilePic: userData.profilePic
      ? `data:${
          userData.profilePic.contentType
        };base64,${userData.profilePic.data.toString("base64")}`
      : null,
  };

  // finds the posts of the selected user
  const userPosts = await feedCollection
    .find({ poster: userData.user })
    .toArray();

  // modifyed so that if there are images they are included in the response
  const userPostModified = userPosts.map((post) => ({
    _id: post._id,
    poster: post.poster,
    posterProfilePic: userData.profilePic
      ? `data:${
          userData.profilePic.contentType
        };base64,${userData.profilePic.data.toString("base64")}`
      : null,
    subject: post.subject,
    body: post.body,
    likes: post.likes,
    postCreationDate: post.postCreationDate,
    comments: post.comments,
    image: post.image
      ? `data:${post.image.contentType};base64,${post.image.data.toString(
          "base64"
        )}`
      : null,
  }));

  // res.json({ reversedPosts: posts.reverse() });
  res.json({
    // posts from the mainfeed
    profilePostData: userPostModified,

    // profile data based on the query string
    userData: userDataModified,
  });
});

// for getting profile images for feeds
router.get("/getProfileImage/:poster", async (req, res) => {
  try {
    const { poster } = req.params;
    const database = await connectMongo();
    const usersCollection = database.collection("Users");

    const user = await usersCollection.findOne({ user: poster });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.profilePic) {
      // user.profilePic = 'src/assets/defaultUser.jpg'
      return;
    }
  } catch {
    console.log(`Could not fetch profile picture for ${poster}`);
  }

  res.json({
    profilePic: user.profilePic
      ? `data:${
          user.profilePic.contentType
        };base64,${user.profilePic.data.toString("base64")}`
      : null,
  });
});

/*
  This is for when the user travels to a users profile
  The appropriate UID is grabbed and used to search for the profile
  that the user is looking for
 */
router.get("/getID", async (req, res) => {
  const { poster } = req.query;

  const database = await connectMongo();
  const users = database.collection("Users");

  const foundUser = await users.findOne({ user: poster });

  res.json({ userUID: foundUser.UID });
});

export default router;
