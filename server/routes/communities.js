import express from "express";
import connectMongo from "../server.js";
import { ObjectId } from "mongodb";
import multer from 'multer';
import sharp from "sharp";

// setting router
const router = express.Router();


router.use(express.json());

let database;

router.use(async (req, res, next) => {
  if (!database) {
    database = await connectMongo();
  }

  req.db = database;

  next();
});

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });


// retrieving the memebers joined for each community
router.post("/", async (req, res) => {
  const { currentlyJoinedTopics } = req.body;
  let database = await connectMongo();
});

// Checking the amount of members that are in a community
router.post("/retrieveCommunityInformation", async (req, res) => {
  // The list of communities that the user is currently in
  const { currentlyJoinedTopics } = req.body;

  let usersCollection = database.collection("Users");

  // a list of all of the users that are currently made in WOLF
  const documents = await usersCollection.find({}).toArray();

  // contains all community info collections names
  let communitiesInformationCollections = [];

  // getting every collection and caching only the communities
  const allCollections = await database.listCollections().toArray();
  allCollections.forEach((collection) => {
    if (collection.name.includes("Info")) {
      communitiesInformationCollections.push(collection.name);
    }
  });

  // getting the members Count for each community that was made in WOLF
  let communityArr = [];

  for (const community of communitiesInformationCollections) {
    let dynamicCollection = await database.collection(community);

    // contains all communities
    let allCommunitiesSearch = await dynamicCollection.findOne();

    if (allCommunitiesSearch) {
      communityArr.push({
         name: allCommunitiesSearch.communityName,
         communityDescription: allCommunitiesSearch.communityDescription,
         members: allCommunitiesSearch.members,
         posts: allCommunitiesSearch.posts,
         creationDate: allCommunitiesSearch.creationDate,
         owner: allCommunitiesSearch.owner,
         image: allCommunitiesSearch.image ? `data:${allCommunitiesSearch.image.contentType};base64,${allCommunitiesSearch.image.data.toString('base64')}` : null
      })
    }

  }

  res.json(communityArr.sort())

});

router.put('/updateCommunityInformation/:owner/:oldName', upload.single('communityImage'), async(req, res)=> {
  const {owner, oldName} = req.params
  const {communityName, communityDescription} = req.body

  try {
    let database = await connectMongo();

    if (req.file) {
      let communityImage = req.file
      let image = {
        data: await optimizingImg(communityImage.buffer),
        contentType: communityImage.mimetype,
        filename: communityImage.originalname,
      }

      if (communityImage) {
        await database.collection(`${oldName}Info`).updateOne(
          {communityName: `${oldName}`},
          {$set: {image: image}}
        )
      }
    }


    if (communityName) {
      // Checking to see if there is a new community name
      // Copying the old data to the new collections
      await database.collection(`${oldName}Info`).aggregate([
        {$match: {}},
        {$out: `${communityName}Info`}

      ]).toArray()

      await database.collection(`${oldName}Feed`).aggregate([
        {$match: {}},
        {$out: `${communityName}Feed`}

      ]).toArray()

      // Upodating the community name inside the communityInfo collection to make sure that -
      //  the renamed community shows up in users joined communities
      await database.collection(`${communityName}Info`).updateOne(
        {communityName: `${oldName}`},
        {$set: {communityName: `${communityName}`}}
      )

      // Dropping old collections for the old name community to prevent duplicate communities in menus
      await database.collection(`${oldName}Info`).drop()
      await database.collection(`${oldName}Feed`).drop()

      console.log(`${owner} has changed community name! (${oldName} to ${communityName})`)
    }

    if (communityDescription) {
      // Changing description to the new updated description inside the community info collection
     await database.collection(`${communityName ? communityName : oldName}Info`).updateOne(
      {communityName: `${communityName ? communityName : oldName}`},
      {$set: {communityDescription: `${communityDescription}`}})

      console.log(`${owner} has changed community description! (${oldName})`)
    }





  } catch (error) {
    console.log('Error renaming collection ' + error)
  }

})


async function optimizingImg(imageBuffer){
  // For optimizing photos
  const optimizedImageBufferForPosts = await sharp(imageBuffer)
  .resize({width: 300, height: 400, fit: 'contain'})
  .toFormat('jpeg', {quality: 30})
  .toBuffer()

  return optimizedImageBufferForPosts
}

// Creating a community
router.post('/create/:owner', upload.single('communityImage'), async (req, res)=> {

  const {owner} = req.params
  let {communityName, communityDescription} = req.body

  // Filling community description if receieved as null
  if (!communityDescription) {
    communityDescription = 'No Description'
  }

  let communityImage;
  let database = await connectMongo();
  let usersCollection = database.collection("Users");

  let findOwner = await usersCollection.findOne({UID: owner})
  let ownerName = findOwner.user

  // staging the creation of the community
  let today = new Date()
  let creationMonth = today.getMonth() + 1
  let creationDay = today.getDay()
  let creationYear = today.getFullYear()

  console.log(`${communityName} was created on ${creationMonth}-${creationDay}-${creationYear}`)

  if (req.file) {
    communityImage = req.file
  }

  // Community information to add to the Info collection
  const communityProps = {
    communityName: communityName,
    communityDescription: communityDescription,
    members: [
      ownerName
    ],
    creationDate: `${creationMonth}/${creationDay}/${creationYear}`,
    owner: ownerName,
    posts: 0
  }

  // First community post to initiate the feed
  const firstMessage = {
    poster: ownerName,
    subject: `Welcome to ${communityName}!`,
    body: `${communityDescription}`,
    likes: [],
    postCreationDate: new Date(),
    comments: [],
  }

  // If the community owner uploads a community photo
  if (communityImage) {
    // image blueprint
    communityProps.image = {
      data: await optimizingImg(communityImage.buffer),
      contentType: communityImage.mimetype,
      filename: communityImage.originalname,
    }
  }

  // attempting to create a community
  try {
    // Getting a array of all collections
    let findCollection = await database.listCollections().toArray()

    // check if community exists
    const foundCommunity = findCollection.some(community => community.name === communityName + 'Info' || community.name === communityName + 'Feed')

    if (foundCommunity) {
      console.log(`Community already exists`)
      // return to the client that the community exists
      res.json({existingCommunityCheck: true})
      return
    } else {
      // Uploading the new community Feed to the DB
      let newCommunity = await database.collection(communityName + 'Feed').insertOne(firstMessage)
      // Uploading the community info to the DB
      let newCommunityInfo = await database.collection(communityName + 'Info').insertOne(communityProps)
      // Adding the new community to the owners list of joined communities
      findOwner.topics.push(communityName)

      res.json({existingCommunityCheck: false})

      console.log(`New community Created on ${new Date()}`)
    }

  } catch (error) {
    console.log(error + " Unable to create community or community already exists")
  }

})


// Deleting a community
router.delete('/delete/:communityToDelete', async (req, res)=> {
  const {communityToDelete} = req.params

  try {
    let database = await connectMongo();

    await database.collection(`${communityToDelete}Info`).drop()
    await database.collection(`${communityToDelete}Feed`).drop()

    console.log(`Successfully deleted a community (${communityToDelete})`)
  } catch (error) {
    console.log(`Could not delete ${communityToDelete} \n ${error}`)
  }

})

export default router;
