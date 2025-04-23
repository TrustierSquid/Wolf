
### Getting started with development

- Clone repository
- install dependencies
```plaintext
   npm i
```
- [Create an account with MongoDB Atlas](https://account.mongodb.com/account/login)
- To set up your own database instance, create your own env file inside of /server
- Add the database connection URI to your .env file

```plaintext
DB_URI=mongodb+srv://<username>:<password>@wolfcluster0.mongodb.net/<dev-yourname>?retryWrites=true&w=majority
```

- Name your database inside the DB_URI variable with this convention
```plaintext
dev-<yourname>
```
#### Running the app on your machine

- Open two terminals, one for the client and another for the server

- For the client run:
```plaintext
   npm run dev
```

- For the server, run:
```plaintext
   nodemon server.js
```

## App Description and versions

- Built with Node/Express.
- Frontend is built with React.
- Uses MongoDB Node.js Driver v6.8.
- Styled with SCSS.

- ![Wolf Picture](/src/assets/wolfSS.png)

#### Features that are to arrive in upcoming versions

- Posting a message with a subject and body.
- Selecting topics that may interest the user and being served information based on the topics the user selects.
- Following other users based on what topics they like.
- Send likes and comments to other users posts.

# Feature Updates

### 1.0 alpha

- You can only post to the social media feed.
- The feed currently is universal so all users will see the same user feed.
- Wolf bot currently posts one fact about the topic that a user clicks on.

### 2.0 alpha

- You can now follow the different users only when they make a post to the main feed
- UI revamp
- Removed Wolf bot

![Wolf Picture](/src/assets/readmePhotos/newBeta.png)

### 3.0 alpha

![Wolf Picture](/src/assets/readmePhotos/productionWolf.png)

- Users are now able to send comments to posts in their respective feeds.
- Users are now able to view their own profile.
- UI Tweaks

#### Topic system changes

![Wolf Picture](/src/assets/readmePhotos/topicsWolf.png)

- Instead of having the user sign up and join topics on account creation, the user will be given the freedom to choose wether or not they would want to be involved in a community (topic)
- UX: Created a system to encourage the user to join a topic if they havent already.
- UX: When a user views their profile, they can now filter their posts by topic.


### 1.0 Beta

![Wolf Picture](/src/assets/readmePhotos/aprilUpdate.png)

- Users can comment on each others post.
- Users can see who liked a post
- Dens (Communities) can now be created and moderated
- A proper follow and unfollow system was implemented

