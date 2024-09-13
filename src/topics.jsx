import React from 'react'
import ReactDOM from 'react-dom/client'
import '/src/assets/index.css'
import Topics from './components/mainComponents/Topics'
import { useEffect, useState } from 'react'


function App() {
  const [loggedInUID, setLoggedInUID] = useState(null)

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
    }

    getUserData();
  }, []);

  useEffect(()=> {
    console.log(`Here is the currently logged in UID ${loggedInUID}`)
  }, [loggedInUID])

  return (
    <React.StrictMode>
      <Topics loggedInUID={loggedInUID} />
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
