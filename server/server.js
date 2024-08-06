import express from 'express';
import dotenv from 'dotenv'; dotenv.config()
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// returns newUser identity
import signinRoutes from './routes/signin.js';

import requireAuth from './middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';

// mongoDB
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

// list of topics for the user to choose from
import topics from './json/topics.json' assert {type: 'json'};


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT;

// express server setup
const app = express();

// Creating new mongoClient instance
const uri = process.env.DB_URI;

// IMPORTED ROUTES
app.use('/users', signinRoutes)


// MIDDLEWARE

// serve static files from this directory 
app.use(express.static(path.join(__dirname, 'dist')));

app.use(cookieParser());
app.use(express.json())
app.use(cors())
app.use((req, res, next)=> {
   if (req.url.endsWith('.jsx')) {
      res.setHeader('Content-Type', 'application/javasccript');
   }
   next()
})


// database configuration
let database =  null;
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
})

// establishing a connection to mongodb
async function connectMongo(){
   if (database) return database

   try {
      await client.connect()
      database = client.db(process.env.DB_NAME)
      console.log("Connected to MongoDB")
      return database

   } catch (err) {
      console.log("Error connecting to MongoDB")
   }
   
}

connectMongo()


// on load Send user to login screen
app.get('/', (req, res)=> {
   res.sendFile(path.join(__dirname, './dist/index.html'))
   console.log("User arrived at login screen")
})

// Getting the list of topic that the user can choose from
app.get('/api/topics', requireAuth, (req, res)=> {
   res.json(topics)  
})

   
app.listen(port, async ()=> {
   console.clear();
   console.log(`Server is running on port ${port}`)

})

export default connectMongo;