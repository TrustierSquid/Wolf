import { forwardRef, useRef, useState, useEffect } from "react"
import Navbar from "../componentDependencies/NavBar"

export default function Profile(){
   const [followerCount, setFollowerCount] = useState([])
   const [followingCount, setFollowingCount] = useState([])

   // and checking user action based off of username
   const [username, setUsername] = useState(null)

   // the an array of the topics that the user selected
   const [userData, setUserData] = useState([])


   // GETTING USER INFORMATION AND DISPLYING IT ON THE HOME PAGE SPECIFIC TO THE USER LOGGED IN
   useEffect(()=> {
      async function getUserData(){
         const response = await fetch(`/users/homeFeed`, {
            method: 'GET',
            credentials: "include",
            headers: {
               'Content-Type': 'application/json',
            }
         })

         if (!response.ok) {
            console.log("Couldn't get user data")
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const homeData = await response.json()
         // console.log(homeData.followingCount.length)
         // setting the user info needed as glob vars

         // the topics the current user selected
         setUserData(homeData.topicArr)

         // the current user logged in
         setUsername(homeData.userName)

         //  the current users following count
         setFollowingCount(homeData.followingCount.length)

         // the current users follower count
         setFollowerCount(homeData.followerCount.length)


      }

      getUserData()

   }, [])




   return (
      <>
         <Navbar/>
         <main id="mainProfile">
            <div className="profileAnalytics">
               <section className="profileSectionInfo">
                  <h1>Samuel</h1>
                  <p>Developer</p>
                  {/* Add a bio */}
               </section>
               <section className="profileSectionInfo">
                  <h2>User Analytics</h2>
                  <br />
                  <div id="showUserStats">
                     <span>
                        <p>0</p>
                        <h4>Followers</h4>
                     </span>
                     <span>
                        <p>0</p>
                        <h4>Following</h4>
                     </span>
                  </div>
               </section>
            </div>

            <h1 className="profHeaders">Your Posts</h1>
            <div className="profileAnalytics">
               <section className="profileSectionInfo">
                  {/* Add a bio */}
               </section>
            </div>




         </main>
      </>
   )
}