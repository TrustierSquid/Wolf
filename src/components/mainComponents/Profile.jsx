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

   const [profilePostData, setProfilePostData] = useState([])

   useEffect(()=> {
      if (!username) return

      async function getUserProfilePosts() {
         try {
            const response = await fetch(`/profileData?user=${username}`, {
               method: "GET",
               headers: {
                  'Content-Type': 'application/json'
               },
            })

            const profileData = await response.json()
            setProfilePostData(profileData)


         } catch {
            throw new Error("Couldnt fetch for profile data")
         }

         // console.log(profileData)

      }

      getUserProfilePosts()



   }, [username])


   function checkUserType(){
      switch (username) {
         // For developers
         case 'Samuel':
            return (
               <>
                  <h2>{username}</h2>
                  <h5 className="profileUserTypeHeader"
                  style={{color: "#00b3ff"}}>
                     Developer <i className="fa-solid fa-code"></i></h5>
               </>
            )
         // For regular users
         case username:
            return (
               <>
                  <h1>{username}</h1>
                  <h5 className="profileUserTypeHeader"
                  style={{color: "grey"}}>User<i className="fa-solid fa-code"> </i></h5>
               </>
            )
         case 'DemoUser':
            return (
               <>
                  <h1>{username}</h1>
                  <h5 className="profileUserTypeHeader"
                  style={{color: "#73ff00"}}>Recruiter<i className="fa-solid fa-code"></i></h5>
               </>
            )
      }
   }


   return (
      <>
         <Navbar/>
         <main id="mainProfile">
            <h2 className="profHeaders">Profile Overview</h2>
            <div className="profileAnalytics">
               <section className="profileSectionInfo">
                  {checkUserType()}
                  {/* Add a bio */}
               </section>
               <section className="profileSectionInfo">
                  <h3>User Analytics</h3>
                  <br />
                  <div id="showUserStats">
                     <span>
                        <p>{followerCount}</p>
                        <h4>Followers</h4>
                     </span>
                     <span>
                        <p>{followingCount}</p>
                        <h4>Following</h4>
                     </span>
                  </div>
               </section>
            </div>

            <h2 className="profHeaders">Your Posts</h2>
            <div className="profileAnalytics">

               {profilePostData.map((post)=> {
                  return (
                     <>
                        <article className="existingPost">
                           <h2 className="profilePostSubject"><i style={{color: "red"}} className="fa-solid fa-earth-americas"></i> {post.subject}</h2>

                           <div className="profilePostAnalytics">
                              <h2><i className="fa-solid fa-heart"></i> {post.likes.length}</h2>
                              <h2><i className="fa-solid fa-comments"></i> 0</h2>
                           </div>
                        </article>
                     </>
                  )
               })}



            </div>




         </main>
      </>
   )
}