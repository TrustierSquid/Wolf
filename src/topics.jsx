import React from 'react'
import ReactDOM from 'react-dom/client'
import '/src/assets/index.css'
import Topics from './components/mainComponents/Topics'
import { useEffect, useState } from 'react'

// grabbing the logged in user
function App() {
  const [loggedInUID, setLoggedInUID] = useState(null)
  const [userTopicArray, setUserTopicArray] = useState(null)
  const [followerCount, setFollowerCount] = useState(null)
  const [followingCount, setFollowingCount] = useState(null)
  const [username, setUsername] = useState(null)
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

    //  the current users following count
    setFollowingCount(homeData.followingCount.length)

    // the current users follower count
    setFollowerCount(homeData.followerCount.length)

    setProfilePicture(homeData.profilePic)
  }

  // sidebar functionality
  const sidebarProps = {
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
      <Topics loggedInUID={loggedInUID} userTopics={userTopicArray} username={username} sidebarProps={sidebarProps} loggedInUser={username}/>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
