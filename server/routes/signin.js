// express
import express from "express";
// for hashing passwords and other sensitive information
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import crypto from 'crypto'

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

// middleware
router.use(express.json());
router.use(cookieParser());

// init db connection
let database = null;


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

const baseUrl = process.env.BASE_URL;

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
          // sameSite: "none",
          secure: false,
        });

        console.log(`${username} is now logged in. Welcome!`);



        res.redirect(`/home`);

      } else {
        // sending error message that is to be displayed on login page
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
    const UID = crypto.randomBytes(16).toString('hex')
    const users = await req.db.collection("Users");

    // checking to find if the user is already registered
    const document = await users.findOne({ user: username });

    if (document != null) {
      res.json({ taken: "Username already Taken" });
    } else {
      const hash = await bcrypt.hash(password, 11);

      try {
        await users.insertOne({
          user: username,
          password: hash,
          UID: UID,
          isLoggedIn: true,

          // shows followers
          followers: [],

          // shows following
          following: [],
          posts: 0,
          topics: [],
          created: new Date(),
          profilePicture: "",
        });

        const newUser = await users.findOne({ user: username });

        const token = createToken(newUser._id);

        // alive for 3 days
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
          secure: false,
        });

        console.log("Successfully added user!");

        setTimeout(() => {
          res.redirect(`/home`);
        }, 500);
      } catch {
        console.log("failed to give cookie");
        console.log(`Failed to redirect to topic page`);
      }

      // DEV TESTING
    }
  } catch (err) {
    res.json({ error: "Unable to add user" });
  }
});


/*TOPICS PAGE*/



// HOME FEED PAGE
// when the user accesses their home page
router.get("/homeFeed", requireAuth, async (req, res) => {
  const database = await connectMongo();
  const users = database.collection("Users");

  // the logged in user
  let loggedInUser = await users.findOne({
    _id: new ObjectId(req.currentUser),
  });

  let userSelectedTopics = loggedInUser.topics;


  res.json({
    topicArr: userSelectedTopics,
    userName: loggedInUser.user,
    followerCount: loggedInUser.followers,
    followingCount: loggedInUser.following,
    UID: loggedInUser.UID,
    profilePic: loggedInUser.profilePic ? `data:${loggedInUser.profilePic.contentType};base64,${loggedInUser.profilePic.data.toString('base64')}` : null
  });

});

export default router;
