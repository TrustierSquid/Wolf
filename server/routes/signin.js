// express
import express from "express";
// for hashing passwords and other sensitive information
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";

// for file redirections
import path from "path";
import { fileURLToPath } from "url";

// for Database connectivity
import connectMongo from "../server.js";
import { ObjectId } from "mongodb";

// for serving cookies and session data
import jsonwebtoken from "jsonwebtoken";

// middleware for protecting routes
import requireAuth from "../middleware/authMiddleware.js";

// cookie parser
import cookieParser from "cookie-parser";

// setting router
const router = express.Router();

// pathfinding to static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let database = null;

// middleware
router.use(express.json());

router.use(cookieParser());

// with this middleware you are shipping each req object with a database prop
router.use(async (req, res, next) => {
  if (!database) {
    database = await connectMongo();
  }

  req.db = database;

  next();
});


// calculating the expiration for jwt
const maxAge = 3 * 24 * 60 * 60;
// creating JWT
const createToken = (userId) => {
   // payload is the userID and the signature is the secret key
  return jsonwebtoken.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};


/* 



LOGIN PAGE


 */



// SIGNING IN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await req.db.collection("Users");

    // checking to find if the user is already registered
    const user = await users.findOne({ user: username });

    if (user != null) {
      // if it finds the matching user

      // grabs entered password, hashes it and compares it to the hashed password in the database
      const auth = await bcrypt.compare(password, user.password);

      if (auth) {
        const token = createToken(user._id);
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
          secure: false,
        });
        
        // DEV TESTING
        res.json({ success: true });

      
      /* for prod */
      // res.sendFile(path.join(__dirname, "./dist/home.html"));

        console.log(`${username} is now logged in. Welcome!`);
      } else {
        res.json({ err: "Password is incorrect" });
        console.log("Password is incorrect");
      }
    } else {
      res.json({ err: "Invalid username or password, Try again.." });
      console.log("Invalid username or password");
    }
  } catch (err) {
    console.log(err);
    console.log({ err: "Failed to get Users" });
  }
});



// ADDING A NEW USER

router.post("/add", async (req, res) => {
  const { username, password } = req.body;
  

  try {
    const users = await req.db.collection("Users");

    // checking to find if the user is already registered
    const document = await users.findOne({ user: username });

    if (document != null) {
      res.json({ taken: "Username already Taken" });
    } else {
      
      
      const hash = await bcrypt.hash(password, 11);

      await users.insertOne({
        user: username,
        password: hash,
        isLoggedIn: true,
        followerCount: 0,
        followingCount: 0,
        posts: 0,
        topics: [],
        lastLogin: new Date(),
        profilePicture: "",
      });

      const newUser = await users.findOne({ user: username });

      const token = createToken(newUser._id);
      // alive for 3 days
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
        secure: true,
      });

      // req.session.userId = newUser._id;

      // DEV TESTING
      res.json({ successMessage: true });
      console.log("Successfully added user!");

    }
  } catch (err) {
    res.json({ error: "Unable to add user" });
  }
});


/* 


TOPICS PAGE


*/


// RECORDING THE TOPICS THE NEWUSER SELECTS
// when the user selects a topic it pushes to the db
router.post("/topics", requireAuth, async (req, res) => {
  const { topic } = req.body;

  const database = await connectMongo();
  const users = await database.collection("Users");

  const documentLookup = await users.findOne({
    _id: new ObjectId(req.currentUser),
  });

  if (documentLookup) {
    console.log("We are golden Baby!");

    // values to update
    const updateValues = {
      $push: {
        topics: topic,
      },
    };

    const result = await users.updateOne(
      { _id: new ObjectId(req.currentUser)},
      updateValues
    );

    console.log("Updated topics");
  } else {
    console.log("Failed to find user");
  }
});



// when the user deselects a topic
router.delete("/topics", requireAuth, async (req, res) => {
  const { topic } = req.body;

  const database = await connectMongo();
  const users = database.collection("Users");

  const documentLookup = await users.findOne({
    _id: new ObjectId(req.currentUser),
  });

  if (documentLookup) {
    console.log("We are golden Baby!");

    // values to update
    const updateValues = {
      $pull: {
        topics: topic,
      },
    };

    const result = await users.updateOne(
      { _id: new ObjectId(req.currentUser) },
      updateValues
    );

    console.log("Updated topics (delete)", result);
  } else {
    console.log("Failed to find user");
  }

  /* const index = userTopic.indexOf(topic)
   if (index > -1) {
      userTopic.splice(index, 1)
   }  */
});


/* 


HOME FEED PAGE


 */

router.get('/home', requireAuth, async (req, res)=> {
  const database = await connectMongo()
  const users = database.collection('Users')

  // the logged in user
  let loggedInUser = await users.findOne({_id: new ObjectId(req.currentUser)})
  let userSelectedTopics = loggedInUser.topics
  

  res.json({topicArr: userSelectedTopics, userName: loggedInUser.user})
  console.log(`Sent topics ${loggedInUser.topics} `)
   
   

})



export default router;
