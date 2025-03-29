// Setting up environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";

// Library for optimizing images
import sharp from "sharp";

// IMPORTING ROUTES
import signinRoutes from "./routes/signin.js";
import profileRoutes from "./routes/profileData.js";
import topicFeedRoutes from "./routes/topicFeed.js";
import handleCommunity from "./routes/communities.js";

// To check if the user has a token for accessing certain routes
import requireAuth from "./middleware/authMiddleware.js";

// MONGODB data storing and uploading images to the DB
import { MongoClient, ServerApiVersion, ObjectId, GridFSBucket } from "mongodb";
import multer from "multer";

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
app.use(express.static(path.join(__dirname, "./dist")));

app.use("/users", signinRoutes);
app.use("/profileData", profileRoutes);
app.use("/loadTopicFeed", topicFeedRoutes);
app.use("/community", handleCommunity);
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
    // let databaseAd = client.db('admin');
    database = client.db(process.env.DB_NAME);
    let imagesCollection = database.collection("images");

    console.log(`Connected to ${database.databaseName} Database`);
    return database;
  } catch (err) {
    console.log("Error connecting to MongoDB!");
  }
}

connectMongo();

// Image optimizing
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// For optimizing images when they are uploaded
async function imageOptimize(imageBuffer, isImageForPosts) {
  const optimizedImageBuffer = await sharp(imageBuffer)
    .resize({ width: 75, height: 75, fit: "cover" })
    .toFormat("png", { compressionLevel: 2 })
    .toBuffer();

  const optimizedImageBufferForPosts = await sharp(imageBuffer)
    .resize({ width: 700, height: 600, fit: "contain" })
    .toFormat("jpeg", { quality: 50 })
    .toBuffer();

  if (isImageForPosts === "profile") {
    // Return image optimized for profile pictures
    return optimizedImageBuffer;
  } else {
    // Return image optimized for posts
    return optimizedImageBufferForPosts;
  }
}

//  For the main feed
// Sends the current list of posts in the mainFeed
app.get("/update", async (req, res) => {
  const database = await connectMongo();
  const mainFeedCollection = database.collection("mainFeed");

  // grabbing all posts on the home feed
  const posts = await mainFeedCollection.find({}).toArray();

  // helper function for grabbing profile information as needed as we need this for accessing the users profile pic
  const helperForProfilePic = async (poster) => {
    // Searching for the posters profilei information
    const searchedUser = await database
      .collection("Users")
      .findOne({ user: poster });

    if (!searchedUser) {
      throw new Error(`User with poster ${poster} not found`);
    }

    return searchedUser.profilePic
      ? `data:${
          searchedUser.profilePic.contentType
        };base64,${searchedUser.profilePic.data.toString("base64")}`
      : "src/assets/defaultUser.jpg";
  };

  // Process posts with asynchronous handling for profile pictures
  const responsePost = await Promise.all(
    posts.map(async (post) => {
      const posterProfilePic = await helperForProfilePic(post.poster);
      return {
        _id: post._id,
        poster: post.poster,
        posterProfilePic: posterProfilePic,
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
      };
    })
  );

  // res.json({ reversedPosts: posts.reverse() });
  res.json({ reversedPosts: responsePost.reverse() });
});

// For when user creates a new post
app.post("/newPost", upload.single("image"), async (req, res) => {
  const { feed } = req.query;
  const { whoPosted, postSubject, postBody } = req.body;
  const imageFile = req.file;

  // if no feed is selected, post will default to mainFeed
  if (feed === "Home") {
    // retrieving the username, and post details (subject, body)

    // Updating the poster's post count
    let database = await connectMongo();
    const users = database.collection("Users");
    const mainFeed = database.collection("mainFeed");

    // Fetching the poster of the new post
    const filter = { user: whoPosted };

    // action for updating the document
    const updateDoc = {
      $inc: {
        posts: 1,
      },
    };

    // document update for the user document in the user collection
    // This just increments the number of posts that is displayed a users document
    const updatePosts = await users.updateOne(filter, updateDoc);

    // adding the post to the DB to the respective feed
    const newPostData = {
      poster: whoPosted,
      subject: postSubject,
      body: postBody,
      likes: [],
      postCreationDate: new Date(),
      comments: [],
    };

    // If an image exists inside this post attempt
    if (imageFile) {
      newPostData.image = {
        data: await imageOptimize(imageFile.buffer, "post"),
        contentType: imageFile.mimetype,
        filename: imageFile.originalname,
      };
    }

    const newPost = await mainFeed.insertOne(newPostData);

    res
      .status(201)
      .json({ message: "Post created successfully", id: newPost.insertedId });
    // Adding the post to the database will lead to a call to action on the frontend
    // The frontend will load this collection in the database to show the user feed
  } else {
    // Updating the poster's post count
    let database = await connectMongo();
    const users = database.collection("Users");
    const selectedFeed = database.collection(feed + "Feed");

    // poster
    const filter = { user: whoPosted };
    const updateDoc = {
      $inc: {
        posts: 1,
      },
    };

    const updatePosts = await users.updateOne(filter, updateDoc);

    // adding the post to the DB to the respective feed
    const newPostData = {
      poster: whoPosted,
      subject: postSubject,
      body: postBody,
      likes: [],
      postCreationDate: new Date(),
      comments: [],
    };

    if (imageFile) {
      newPostData.image = {
        data: await imageOptimize(imageFile.buffer, "post"),
        contentType: imageFile.mimetype,
        filename: imageFile.originalname,
      };
    }

    const newPost = await selectedFeed.insertOne(newPostData);

    res
      .status(201)
      .json({ message: "Post created successfully", id: newPost.insertedId });
  }
});

// User uploads profile picture
app.post(
  "/uploadProfilePicture/:loggedInUser",
  upload.single("image"),
  async (req, res) => {
    try {
      const imageFile = req.file;
      const { loggedInUser } = req.params;

      const profilePic = {
        data: await imageOptimize(imageFile.buffer, "profile"),
        contentType: "image/jpeg",
        filename: imageFile.originalname,
      };

      let database = await connectMongo();
      const users = database.collection("Users");

      let foundUser = await users.updateOne(
        { UID: loggedInUser },
        { $set: { profilePic } }
      );

      // res.status(201).json({ message: 'Post created successfully', id: imageToPost.insertedId});
      console.log({ message: `${loggedInUser} Changed profile picture!` });
    } catch {
      console.log("Could not update profile picture!");
    }
  }
);

let latestLikeCounter = null;

// adding a like to a post
app.post("/addLike", requireAuth, async (req, res) => {
  const { postID, loggedInUser } = req.body;
  const { feed } = req.query;

  const database = await connectMongo();

  // Looking up the user in question
  const users = database.collection('Users')

  // User is found we can now acess the user data from here
  let foundUser = await users.findOne({
    user: loggedInUser
  })

  let likeBluePrint = {
    dynamicUser: foundUser.user,
    dynamicUID: foundUser.UID,
    dynamicProfilePic: foundUser.profilePic
  }

  // By default, will look through the posts on the mainfeed to find the searched post
  if (feed === "mainFeed") {
    const posts = database.collection("mainFeed");

    // Find a duplicate user
    let findDuplicateUser = await posts.findOne({
      _id: new ObjectId(postID),
      likes: { $elemMatch: { dynamicUser: loggedInUser } },
    });

    // If the user is already liking a post, then they will be removed from the array
    if (findDuplicateUser) {
      await posts.updateOne(
        { _id: new ObjectId(postID) },
        { $pull: { likes: likeBluePrint } }
      );

      res.json({ latestLikeCounter });
    } else {
      await posts.updateOne(
        { _id: new ObjectId(postID) },
        { $push: { likes: likeBluePrint } }
      );

      res.json({ latestLikeCounter });
    }

  } else {
    // Find the post through other community feeds
    const posts = database.collection(feed);

    // Find a duplicate user
    let findDuplicateUser = await posts.findOne({
      _id: new ObjectId(postID),
      likes: { $elemMatch: { dynamicUser: loggedInUser } },
    });

    // If the user is already liking a post, then they will be removed from the array
    if (findDuplicateUser) {
      await posts.updateOne(
        { _id: new ObjectId(postID) },
        { $pull: { likes: likeBluePrint } }
      );

      res.json({ latestLikeCounter });
    } else {
      await posts.updateOne(
        { _id: new ObjectId(postID) },
        { $push: { likes: likeBluePrint } }
      );

      res.json({ latestLikeCounter });
    }
  }
});

// Gather the number of likes a post has
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

  // getting the followw document
  let findFollowee = await users.findOne({
    UID: followee,
  });

  // getting the logged in user document
  let findLoggedInUser = await users.findOne({
    UID: loggedInUser,
  });

  // Profile pic of the current user initiaing the follow or unfollow
  let currentUserProfilePic = findLoggedInUser.profilePic;

  // grabbing the names out of both documents
  (findFollowee = findFollowee.user),
    (findLoggedInUser = findLoggedInUser.user);

  // checks to see if a user is already a follower of a user
  const duplicateUserFollowing = await users.findOne({
    user: findLoggedInUser,
    following: { $in: [findFollowee] },
  });

  const duplicateUserFollower = await users.findOne({
    user: findFollowee,
    followers: { $in: [findLoggedInUser] },
  });

  // This is the notification that gets sent to the followee
  let followNotif = {
    title: `${findLoggedInUser} is now following you.`,
    initiatorProfilePic: currentUserProfilePic
      ? `data:${
          currentUserProfilePic.contentType
        };base64,${currentUserProfilePic.data.toString("base64")}`
      : null,
    date: new Date(),
  };

  if (duplicateUserFollowing || duplicateUserFollower) {
    // Unfollowing
    try {
      // updating current users following list
      await users.updateOne(
        { user: findLoggedInUser },
        { $pull: { following: findFollowee } }
      );

      // updating followee list
      await users.updateOne(
        { user: findFollowee },
        { $pull: { followers: findLoggedInUser } }
      );
      res.sendStatus(200);
    } catch {
      console.log("Unable to complete the follow transaction");
    }
  } else {
    // Following
    try {
      // updating current users following list
      await users.updateOne(
        { user: findLoggedInUser },
        { $addToSet: { following: findFollowee } }
      );

      // updating followee list
      await users.updateOne(
        { user: findFollowee },
        { $push: { followers: findLoggedInUser } }
      );

      // Sending notification to followee
      await users.updateOne(
        { user: findFollowee },
        { $addToSet: { notifications: followNotif } }
      );

      res.sendStatus(200);
    } catch {
      console.log("Unable to complete the follow transaction");
    }
  }
});

// Handles when a user joins a community
app.get("/topicsAdd", async (req, res) => {
  const { topicToAdd } = req.query;

  // loggedIn User by user name
  const { username } = req.query;

  // LoggedIn user by id
  const { loggedInUser } = req.query;

  const database = await connectMongo();
  const users = database.collection("Users");

  let loggedInUserDocument = await users.findOne({ user: username });

  let dynamicCollection = database.collection(topicToAdd + "Info");

  // checking to see if it exists in the topics array

  // making sure the loggedInUser is not counted as a member
  let findMember = await dynamicCollection.findOne({
    communityName: topicToAdd,
    members: { $elemMatch: { member: username } },
  });

  // memberObject staging
  let member = {
    member: username,
    memberProfilePic: loggedInUserDocument.profilePic
      ? `data:${
          loggedInUserDocument.profilePic.contentType
        };base64,${loggedInUserDocument.profilePic.data.toString("base64")}`
      : null,
  };

  if (!findMember) {
    // if both are false then the user gets added
    // add the loggedin user to the member
    await dynamicCollection.updateOne(
      { communityName: topicToAdd },
      { $push: { members: member } }
    );

    res.sendStatus(200);
    console.log(`${loggedInUser} has joined the ${topicToAdd} community!`);
  } else {
    //  if findmember is true it means it found an existing member with the same name and will pull the name

    await dynamicCollection.updateOne(
      { communityName: topicToAdd },
      { $pull: { members: { member: username } } }
    );

    console.log(`${loggedInUser} has left the ${topicToAdd} community!`);

    res.sendStatus(200);
  }
});

// remove user from community (den)
app.put("/removeCommunity/:community/:UID/:username", async (req, res) => {
  try {
    const { community, UID, username } = req.params;

    const database = await connectMongo();
    const usersCollection = database.collection("Users");

    const dynamicCollection = database.collection(community + "Info");

    // Removing the member from the community
    await dynamicCollection.updateOne(
      { communityName: community },
      { $pull: { members: { member: username } } }
    );

    console.log(`${username} has left ${community}`);

    res.json({ success: 200 });
  } catch {
    console.log(`Could not pull user from ${community}`);
  }
});

// Updating user bio
app.post("/updateBio/:UID", async (req, res) => {
  const { UID } = req.params;
  const { newBio } = req.body;

  // connect to DB
  const database = await connectMongo();
  const usersCollection = database.collection("Users");

  await usersCollection.updateOne({ UID: UID }, { $set: { userBio: newBio } });

  res.sendStatus(200);
});

// Adding a comment to a post
app.post("/addPostComment", async (req, res) => {
  const { postID } = req.query;
  const { feed } = req.query;
  const { commentFrom } = req.query;
  const { comment } = req.body;

  const database = await connectMongo();
  const collection = database.collection(feed);
  const users = database.collection("Users");

  let commenterProfilePic = await users.findOne({ user: commentFrom });

  // the comment to push to the database
  let newComment = {
    from: commentFrom,
    commenterProfilePicImg: commenterProfilePic.profilePic
      ? `data:${
          commenterProfilePic.profilePic.contentType
        };base64,${commenterProfilePic.profilePic.data.toString("base64")}`
      : null,
    comment: comment,
    timePosted: new Date(),
  };

  const result = await collection.updateOne(
    { _id: new ObjectId(postID) },
    { $push: { comments: newComment } }
  );

  res.sendStatus(200);
});

// For searching for a user by username
app.get("/dynamic/:username", async (req, res) => {
  const { username } = req.params;

  const database = await connectMongo();
  const usersCollection = database.collection("Users");

  let searchedUser = await usersCollection.findOne({ user: username });

  res.json({
    dynamicUID: searchedUser.UID,
    dynamicUser: searchedUser.user,
    dynamicProfilePic: searchedUser.profilePic
      ? `data:${
          searchedUser.profilePic.contentType
        };base64,${searchedUser.profilePic.data.toString("base64")}`
      : null,
  });
});

// For searching for a user by UID
app.get("/dynamicUID/:UID", async (req, res) => {
  const { UID } = req.params;

  const database = await connectMongo();
  const usersCollection = database.collection("Users");

  let searchedUser = await usersCollection.findOne({ UID: UID });

  res.json({
    dynamicUID: searchedUser.UID,
    dynamicFollowing: searchedUser.following,
    dynamicFollowers: searchedUser.followers,
    dynamicUsername: searchedUser.user,
  });
});

// Searching for the searched user's followers and following list
app.get("/dynamicFollowers/:userSearching", async (req, res) => {
  // The user we are checking the followers and following profile pics
  const { userSearching } = req.params;

  const database = await connectMongo();
  const usersCollection = database.collection("Users");

  let searchedUser = await usersCollection.findOne({ UID: userSearching });

  let informationStagingFollowing = await Promise.all(
    // For following catagory
    searchedUser.following.map(async (follower) => {
      let searchFollower = await usersCollection.findOne({ user: follower });

      return {
        searchedFollowerUsername: searchFollower.user,
        searchedFollowerProfilePic: searchFollower.profilePic
          ? `data:${
              searchFollower.profilePic.contentType
            };base64,${searchFollower.profilePic.data.toString("base64")}`
          : null,
      };
    })
  );

  let informationStagingFollowers = await Promise.all(
    // For following catagory
    searchedUser.followers.map(async (follower) => {
      let searchFollower = await usersCollection.findOne({ user: follower });

      return {
        searchedFollowerUsername: searchFollower.user,
        searchedFollowerProfilePic: searchFollower.profilePic
          ? `data:${
              searchFollower.profilePic.contentType
            };base64,${searchFollower.profilePic.data.toString("base64")}`
          : null,
      };
    })
  );

  res.json({
    following: informationStagingFollowing,
    followers: informationStagingFollowers,
  });
});



// For clearing notifications
app.put("/clearNotifications/:loggedInUser", async (req, res) => {
  const { loggedInUser } = req.params;
  const database = await connectMongo();
  const usersCollection = database.collection("Users");

  // Clearing notifications for the loggedIn user

  // Find the user that initiated the clear
  await usersCollection.updateOne(
    { user: loggedInUser },
    { $set: { notifications: [] } }
  );
});

// if the user enters any file extension they will be redirected to login again
// for prod
app.get("/home.html", requireAuth, (req, res) => {
  res.redirect("/");
});

app.get("/topics.html", requireAuth, (req, res) => {
  res.redirect("/");
});

app.get("/index.html", requireAuth, (req, res) => {
  res.redirect("/");
});

app.get("/followerPage.html", requireAuth, (req, res) => {
  res.redirect("/");
});

app.get("/communities.html", requireAuth, (req, res) => {
  res.redirect("/");
});

// on load Send user to login screen
app.get("/", (req, res) => {
  // for dev
  // res.send('<h1>Login page</h1>')
  res.sendFile(path.join(__dirname, "index.html"));
});

/* TOPICS PAGE*/

// Retrieving the list of topics that the user can choose from
app.get("/api/topics", (req, res) => {
  res.json(topics);
});

/* HOME FEED PAGE */

app.get("/home", requireAuth, (req, res) => {
  // for dev
  res.sendFile(path.join(__dirname, "/dist/home.html"));
});

app.get("/topics", requireAuth, (req, res) => {
  // for dev
  res.sendFile(path.join(__dirname, "/dist/topics.html"));
});

app.get("/profile", requireAuth, (req, res) => {
  // for dev
  res.sendFile(path.join(__dirname, "/dist/profile.html"));
});
app.get("/followerPage", requireAuth, (req, res) => {
  // for dev
  res.sendFile(path.join(__dirname, "/dist/followerPage.html"));
});
app.get("/communities", requireAuth, (req, res) => {
  // for dev
  res.sendFile(path.join(__dirname, "/dist/communities.html"));
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
});

app.listen(port, () => {
  console.clear();
  console.log(`Server running on port ${port}`);
  console.log(currentDate);
});

export default connectMongo;
