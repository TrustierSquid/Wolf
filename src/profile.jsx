import React from 'react'
import ReactDOM from 'react-dom/client'
import '/src/assets/index.css'
import Profile from './components/mainComponents/Profile'
import { useEffect, useState } from 'react'

// grabbing the logged in user
function App() {
  const [loggedInUID, setLoggedInUID] = useState(null)
  const [userTopicArray, setUserTopicArray] = useState(null)

  useEffect(() => {
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
      // console.log(homeData.followingCount.length)
      // setting the user info needed as glob vars
      setLoggedInUID(homeData.UID);
      setUserTopicArray(homeData.topicArr)
    }

    getUserData();
  }, []);

  useEffect(()=> {
    console.log(`Here is the currently logged in UID ${loggedInUID}`)
    console.log(userTopicArray)
  }, [loggedInUID])

  return (
    <React.StrictMode>
      <Profile loggedInUID={loggedInUID} userTopics={userTopicArray}/>
    </React.StrictMode>
  )
}


ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
