import React from "react";
import ReactDOM from 'react-dom/client'
import '/src/assets/stylesheets/index.css'
import '/src/assets/stylesheets/followPage.css'
import '/src/assets/stylesheets/tooltips.css'
import FollowingPageComponent from "./components/componentDependencies/FollowPage";
import { useState, useEffect } from 'react'

function FollowingPageComponentDep(){
   const [loggedInUID, setLoggedInUID] = useState(null)
   const [userTopicArray, setUserTopicArray] = useState(null)
   const [username, setUsername] = useState(null)
   const [followingCount, setFollowingCount] = useState(null)
   const [followerCount, setFollowerCount] = useState(null)

   const [followers, setFollowers] = useState(null)
   const [following, setFollowing] = useState(null)
   const [profilePicture, setProfilePicture] = useState(null)

   async function getUserData() {
     const response = await fetch(`/users/homeFeed`, {
       method: "GET",
       credentials: "include",
       headers: {
         "Content-Type": "application/json",
       },
     });

     if (!response.ok) {
       console.log("Couldn't get user data");
       throw new Error(`HTTP error! status: ${response.status}`);
     }

     const homeData = await response.json();
     // setting the user info needed as glob vars
     setLoggedInUID(homeData.UID);
     setUserTopicArray(homeData.topicArr)

     // the current user logged in
     setUsername(homeData.userName)

     setFollowing(homeData.followingCount)
     setFollowers(homeData.followerCount)


     //  the current users following count
     setFollowingCount(homeData.followingCount.length)

     // the current users follower count
     setFollowerCount(homeData.followerCount.length)

     setProfilePicture(homeData.profilePic)



   }

   async function gettingCommunityNumbers() {
     let response = await fetch(`/community`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({currentlyJoinedTopics: userTopicArray})
     })
   }

   gettingCommunityNumbers()


   const sidebarItems = {
     username: username,
     followings: followingCount,
     followers: followerCount,
     UID: loggedInUID,
     profileImage: profilePicture,
    }


    useEffect(() => {
      getUserData();
    }, []);


   return (
     <React.StrictMode>
       {/*
         User topics for displaying the communities that the user has joined
         The loggedinUID
         updateUserData for in case any data gets changed for the logged in user in the DB
        */}
       <FollowingPageComponent
       loggedInUID={loggedInUID}
       userTopics={userTopicArray}
       updateUserData={getUserData}
       sidebarItems={sidebarItems}
       username={username}
       followers={followers}
       following={following}

       />
     </React.StrictMode>
   )
 }

 ReactDOM.createRoot(document.getElementById('root')).render(<FollowingPageComponentDep/>)
