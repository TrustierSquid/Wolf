import express from 'express';
import dotenv from 'dotenv'; dotenv.config()
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import signinRoutes from './routes/signin.js';
import requireAuth from './middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';

// mongoDB
import { MongoClient, ServerApiVersion } from 'mongodb';

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

// connect to mongodb
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


// Send user to login screen
app.get('/', (req, res)=> {
   res.sendFile(path.join(__dirname, './dist/index.html'))
   console.log("User arrived at login screen")
})

// Getting the list of topic that the user can choose from
app.get('/api/topics', requireAuth, (req, res)=> {
   res.json(topics)  
})



// RECORDING THE TOPICS THE USER SELECTS
// when the user selects a topic
app.post('/api/topics', async (req, res)=> {
   const { topic } = req.body

   const database = await connectMongo()
   const users = await database.collection('Users')

   // allows the new user to select their topics
   let user = await users.findOne({user: username})
   
   if (user) {
      const result = await collection.updateOne(
         {user: username}, //filter
         {$push: {topics: topic}}
      )

   }
   
})

// when the user deselects a topic
app.delete('/api/topics', async (req, res)=> {
   const { topic } = req.body

   const database = await connectMongo()
   const users = database.collection('Users')
   
   await users.deleteOne({topic: topic})
   console.log("removed topic")
   
   
   /* const index = userTopic.indexOf(topic)
   if (index > -1) {
      userTopic.splice(index, 1)
   }  */     
})




   
app.listen(port, async ()=> {
   console.clear();
   console.log(`Server is running on port ${port}`)

})

export default connectMongo;