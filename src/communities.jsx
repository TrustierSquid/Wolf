import React from 'react'
import ReactDOM from 'react-dom/client'
import '/src/assets/index.css'
import '/src/assets/communities.css'
import CommunitySelection from './components/mainComponents/CommunitySelection'
import { useState, useEffect } from 'react'

function AcquireUserInfo(){
  const [loggedInUID, setLoggedInUID] = useState(null)
  const [userTopicArray, setUserTopicArray] = useState(null)

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
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <React.StrictMode>
      <CommunitySelection loggedInUID={loggedInUID} userTopics={userTopicArray} updateUserData={getUserData}/>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<AcquireUserInfo/>)
