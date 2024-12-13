import express from "express";

// for Database connectivity
import connectMongo from "../server.js";

const router = express.Router();

// Grabing the posts based off of what topic was clicked on
// for custom feeds
router.get("/", async (req, res) => {
  const { topicFeed } = req.query;

  const database = await connectMongo();
  const feed = database.collection(topicFeed);

  const posts = await feed.find({}).toArray();

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

  // console.log(posts)

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

export default router;
