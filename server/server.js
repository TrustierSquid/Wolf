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
import handleImages from './routes/imageHandling.js'
import handleCommunity from './routes/communities.js'

// To check if the user has a token for accessing certain routes
import requireAuth from "./middleware/authMiddleware.js";

// MONGODB
import { MongoClient, ServerApiVersion, ObjectId, GridFSBucket } from "mongodb";
import multer from 'multer';
import { Readable } from 'stream';

import GridFsStorage from 'multer-gridfs-storage';
/* import pkg from 'multer-gridfs-storage'
const { GridFsStorage } = pkg */
import crypto from 'crypto'

// list of topics for the user to choose from
import topics from "./json/topics.json" assert { type: "json" };

// A fact that comes with each topic
import topicFacts from "./json/facts.json" assert { type: "json" };
import { connect } from "http2";
// import { connect } from "http2";

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
app.use(express.static(path.join(__dirname,  "./dist")));

app.use("/users", signinRoutes);
app.use("/profileData", profileRoutes);
app.use("/loadTopicFeed", topicFeedRoutes);
app.use('/handleImage', handleImages)
app.use('/community', handleCommunity)
// app.use('/userInteraction', likesRoutes)

// Creating new mongoClient instance
const uri = process.env.DB_URI;
const currentDate = new Date();


// database configuration
let database = null;
// let gfs;

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
    let imagesCollection = database.collection('images')

    console.log(`Connected to ${database.databaseName}`);
    return database;
  } catch (err) {
    console.log("Error connecting to MongoDB!");
  }
}

connectMongo();

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });


// Sends the current list of posts in the mainFeed
app.get("/update", async (req, res) => {

  const database = await connectMongo();
  const mainFeedCollection = database.collection("mainFeed");

  const posts = await mainFeedCollection.find({}).toArray();

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
});


// WHEN THE USER CREATES A NEW POST
app.post("/newPost", upload.single('image'), async (req, res) => {
  const { feed } = req.query;
  const { whoPosted, postSubject, postBody} = req.body;
  const imageFile = req.file

  console.log(req.file)


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

    if (imageFile) {
      newPostData.image = {
        data: imageFile.buffer,
        contentType: imageFile.mimetype,
        filename: imageFile.originalname,
      }
    }

    const newPost = await mainFeed.insertOne(newPostData)


    res.status(201).json({ message: 'Post created successfully', id: newPost.insertedId});
    console.log({ message: 'Post created successfully', id: newPost.insertedId})
    // Adding the post to the database will lead to a call to action on the frontend
    // The frontend will load this collection in the database to show the user feed


  } else {


    // Updating the poster's post count
    let database = await connectMongo();
    const users = database.collection("Users");
    const selectedFeed = database.collection(feed + 'Feed');


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
        data: imageFile.buffer,
        contentType: imageFile.mimetype,
        filename: imageFile.originalname,
      }
    }

    const newPost = await selectedFeed.insertOne(newPostData)

    res.status(201).json({ message: 'Post created successfully', id: newPost.insertedId});
    console.log({ message: 'Post created successfully', id: newPost.insertedId})


  }
});

app.post("/uploadProfilePicture/:loggedInUser", upload.single('image'), async (req, res)=> {
  const imageFile = req.file
  const {loggedInUser} = req.params

  let database = await connectMongo();
  const users = database.collection("Users");

  const profilePic = {
      data: imageFile.buffer,
      contentType: imageFile.mimetype,
      filename: imageFile.originalname,
    }


  let foundUser = await users.updateOne(
    {UID: loggedInUser},
    {$set: {profilePic}}
  )


  // res.status(201).json({ message: 'Post created successfully', id: imageToPost.insertedId});
  // console.log({ message: 'Post created successfully', id: imageToPost.insertedId})

})




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


      res.json({ latestLikeCounter });
    } else {
      await posts.updateOne(
        { _id: new ObjectId(postID) },
        { $push: { likes: loggedInUser } }
      );

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


      res.json({ latestLikeCounter });
    } else {
      await posts.updateOne(
        { _id: new ObjectId(postID) },
        { $push: { likes: loggedInUser } }
      );

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

  // getting the followw document
  let findFollowee = await users.findOne({
    UID: followee
  })

  // getting the logged in user document
  let findLoggedInUser = await users.findOne({
    UID: loggedInUser
  })

  // grabbing the names out of both documents
  findFollowee = findFollowee.user,
  findLoggedInUser = findLoggedInUser.user



  // checks to see if a user is already a follower of a user
  const duplicateUserFollowing = await users.findOne({
    user: findLoggedInUser,
    following: { $in: [findFollowee] },
  });


  const duplicateUserFollower = await users.findOne({
    user: findFollowee,
    followers: { $in: [findLoggedInUser] },
  });


  if (duplicateUserFollowing || duplicateUserFollower) {
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
      res.sendStatus(200)
    } catch {
      console.log("Unable to complete the follow transaction");
    }
  } else {
    try {
      // updating current users following list
      await users.updateOne(
        { user: findLoggedInUser },
        { $addToSet: { following: findFollowee } }
      );

      // updating followee list
      await users.updateOne(
        { user: findFollowee },
        { $addToSet: { followers: findLoggedInUser } }
      );

      res.sendStatus(200)
    } catch {
      console.log("Unable to complete the follow transaction");
    }
  }
});


app.get('/topicsAdd', async (req, res)=> {
  const {topicToAdd} = req.query
  const {username} = req.query

  // by UID
  const {loggedInUser} = req.query


  const database = await connectMongo()
  const users = database.collection('Users')

  let dynamicCollection = database.collection(topicToAdd + 'Info')


  // checking to see if it exists in the topics array
  let findTopic = await users.findOne(
    {UID: loggedInUser,
    topics: {$in: [topicToAdd]} }
  )
  // making sure the loggedInUser is not counted as a member
  let findMember = await dynamicCollection.findOne(
    {communityName: topicToAdd,
    members: {$in: [username]}}
  )



  if (!findTopic && !findMember) {
    // if both are false then the user gets added

    // adding the topic to the loggedIn user's document
    await users.updateOne(
      {UID: loggedInUser},
      {$addToSet: {topics: topicToAdd}}
    )

    // add the loggedin user to the member
    await dynamicCollection.updateOne(
      {communityName: topicToAdd},
      {$push: {members: username}}
    )

    res.sendStatus(200)

  } else {
    await users.updateOne(
      {UID: loggedInUser},
      {$pull: {topics: topicToAdd}}
    )

    await dynamicCollection.updateOne(
      {communityName: topicToAdd},
      {$pull: {members: username}}
    )

    res.sendStatus(200)
  }

})

app.put('/removeCommunity/:community/:UID/:username', async (req, res)=> {
  const { community, UID, username } = req.params

  const database = await connectMongo()
  const usersCollection = database.collection('Users')

  const dynamicCollection = database.collection(community + 'Info')


  await usersCollection.updateOne(
    {UID: UID},
    {$pull: {'topics': community}}
  )

  await dynamicCollection.updateOne(
    {communityName: community},
    {$pull: {members: username}}
  )

  res.json({success: 200})

})

app.post('/updateBio/:UID', async (req, res)=> {
  const { UID } = req.params
  const { newBio } = req.body

  // connect to DB
  const database = await connectMongo()
  const usersCollection = database.collection('Users')

  await usersCollection.updateOne(
    {UID: UID},
    {$set: {userBio: newBio}}
  )

  res.sendStatus(200)


})


app.post('/addPostComment', async (req, res)=> {
  const {postID} = req.query
  const {feed} = req.query
  const {commentFrom} = req.query
  const {comment} = req.body


  const database = await connectMongo()
  const collection = database.collection(feed)

  // the comment to push to the database
  let newComment = {
    from: commentFrom,
    comment: comment,
    timePosted: new Date()
  }

  const result = await collection.updateOne(
    {_id: new ObjectId(postID)},
    {$push: {comments: newComment}}
  )

  res.sendStatus(200)

})


app.get('/dynamic/:username', async (req, res)=> {
  const {username} = req.params

  const database = await connectMongo()
  const usersCollection = database.collection('Users')


  let searchedUser = await usersCollection.findOne({user: username})


  res.json({
    dynamicUID: searchedUser.UID,
  })

})








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
