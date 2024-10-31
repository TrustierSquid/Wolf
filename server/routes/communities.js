import express from "express";
import connectMongo from "../server.js";
import { ObjectId } from "mongodb";

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

// retrieving the memebers joined for each community
router.post("/", async (req, res) => {
  const { currentlyJoinedTopics } = req.body;
  let database = await connectMongo();
});

router.post("/checkMembers", async (req, res) => {
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
         community: allCommunitiesSearch.communityName,
         members: allCommunitiesSearch.members
      })
    }

  }

  communityArr.sort((a, b) => a.community.localeCompare(b.community));


  res.json(communityArr)

  // The staging for adding new props to the community objects
  /* for (let community in currentlyJoinedTopics) {
      // console.log(currentlyJoinedTopics[community] + 'Info')

      let dynamicCollection = database.collection(currentlyJoinedTopics[community] + 'Info')

   } */
});

export default router;
