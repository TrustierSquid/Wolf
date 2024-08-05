
import express from 'express';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import connectMongo from '../server.js';
import jsonwebtoken from 'jsonwebtoken';
import requireAuth from '../middleware/authMiddleware.js';

// setting router
const router = express.Router()

// pathfinding to static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let database = null

// middleware
router.use(express.json())


// with this middleware you are shipping each req object with a database prop
router.use(async (req, res, next) => {
   if (!database) {
      database = await connectMongo()
   }

   req.db = database
   
   next()
})


// calculating the expiration for jwt
const maxAge = 3 * 24 * 60 *60
// creating JWT
const createToken = (id)=> {
   return jsonwebtoken.sign({id}, process.env.JWT_SECRET, {
      expiresIn: maxAge
   })
}



// SIGNING IN
router.post('/login', async (req, res)=> {
   const { username, password } = req.body;

   try {
      
      const users = await req.db.collection('Users')
      
      // checking to find if the user is already registered 
      const user = await users.findOne({user: username})         

      
      if (user != null) { // if it finds the matching user
         // redirects user to home.html

         // grabs entered password, hashes it and compares it to the hashed password in the database
         const auth = await bcrypt.compare(password, user.password)
         
         if (auth) {
            
            const token = createToken(user._id) 
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000, secure: false})
            res.json({success: true})
            
            console.log(`${username} is now logged in. Welcome!`)

         } else {
            res.json({err: 'Password is incorrect'})
            console.log("Password is incorrect")
         }
         

      } else {
         res.json({err: 'Invalid username or password, Try again..'})
         console.log("Invalid username or password")
      }

   } catch (err) {
      console.log(err)
      console.log({ err: 'Failed to get Users' })
   }
   
})


// ADDING A NEW USER

router.post('/add', async (req, res)=> {
   const { username, password } = req.body
   
   try {

      const users = await req.db.collection('Users')

      // checking to find if the user is already registered 
      const document = await users.findOne({user: username})

      if (document != null) {
         res.json({taken: "Username already Taken"})

      } else {
         const hash = await bcrypt.hash(password, 11);

         await users.insertOne({
            user: username, 
            password: hash, 
            isLoggedIn: true, 
            followerCount: 0, 
            followingCount: 0, 
            posts: 0, 
            topics: {},
            lastLogin: new Date(),
            profilePicture: ''
         });

         const newUser = await users.findOne({user: username})

         const token = createToken(newUser._id)
         // alive for 3 days
         res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000, secure: false})
         res.json({success: true})
         console.log('Successfully added user!')
         // res.sendFile(path.join(__dirname, 'dist', 'user.html'))
      }
      
   } catch (err) {
      res.json({error: "Unable to add user"})
   }
   
})


export default router;