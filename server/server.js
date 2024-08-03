import express from 'express';
import dotenv from 'dotenv'; dotenv.config()
import path from 'path';
import { fileURLToPath } from 'url';
// mongoDB
import { MongoClient, ServerApiVersion } from 'mongodb';

// list of topics for the user to choose from
import topics from './json/topics.json' assert {type: 'json'};
import selectedTopics from './json/selectedTopics.json' assert {type: 'json'};

// Creating new mongoClient instance
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});

// express server setup
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json())


app.get('/api/topics', (req, res)=> {
   res.json(topics)
})

app.get('/', (req, res)=> {
   res.sendStatus(200);
})

// SIGNING IN
app.post('/api/signin', async (req, res)=> {
   const { username, password } = req.body;

   if(!username || !password) {
      res.json({ err: 'both username and password are needed' })
   }
   
   try {
      await client.connect();
      const database = client.db('Wolf')
      const collection = database.collection('Users')

      
      // checking to find if the user is already registered 
      const document = await collection.findOne({user: username, password: password})

      // grabbing userId
      const userId = document._id
      
      
      if (document != null) {
         // redirects user to home.html
         console.log(`Welcome ${username}`)
         res.json({log: `${username} successfully logged in`})

      } else {
         res.json({err: 'Invalid username or password'})
      }

   } catch (err) {
      res.json({ err: 'Failed to get Users' })
   } finally {
      await client.close()
   }
})

// ADDING A NEW USER

app.post('/api/signin/add', async (req, res)=> {
   const { username, password } = req.body
   
   if(!username || !password) {
      res.status(400).json({ err: 'both username and password are needed' })
   }

   try {
      await client.connect();
      const database = client.db('Wolf')
      const collection = database.collection('Users')

      // checking to find if the user is already registered 
      const document = await collection.findOne({user: username})

      if (document != null) {
         console.log('User already registered')
         res.json({taken: "User already registered"})
      } else {
         await collection.insertOne({user: username, password: password})
         console.log('Successfully added user!')
         res.redirect('/user.html')
         topicSelection(userId)
      }

   } finally {
      await client.close()
   }
   
   

})

// recording the liked topics of the user, later to be pushed to the database
let userTopic = [];

app.post('/api/topics', (req, res)=> {
   const { topic } = req.body
   
   userTopic.push(topic)

   console.log(userTopic)
   
})

app.delete('/api/topics', (req, res)=> {
   const { topic } = req.body

   const index = userTopic.indexOf(topic)
   if (index > -1) {
      userTopic.splice(index, 1)
   }   
   
   console.log(userTopic)
})

app.post('/api/topics/finalize', (req, res)=> {
   
})


app.listen(port, async ()=> {
   console.clear();
   console.log(`Server is running on port ${port}`)

})
/* 
async function testDB(){
   await client.connect();
   const database = client.db("Wolf")
   const collection = database.collection("Users")

   const cursor = collection.find({username: "User123"})
   const documents = await cursor.toArray()
   
   console.log(documents)

   
}

testDB() */
