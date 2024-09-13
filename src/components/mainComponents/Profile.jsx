import { forwardRef, useRef, useState, useEffect} from "react"
import { useLocation } from "react-router-dom"
import Navbar from "../componentDependencies/NavBar"

export default function Profile(){
   const [followerCount, setFollowerCount] = useState([])
   const [followingCount, setFollowingCount] = useState([])

   // and checking user action based off of username
   const [username, setUsername] = useState(null)

   // the an array of the topics that the user selected
   const [userData, setUserData] = useState([])


   // Data for the user logged in
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
   const [userProfileData, setUserProfileData] = useState([])

   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString)
   const userSearched = urlParams.get('user')

   const [dynamicUsername, setDynamicUsername] = useState(null)

   useEffect(()=> {
      if (!userSearched) return


      async function getUserProfilePosts() {
         try {
            const response = await fetch(`/profileData?user=${userSearched}`, {
               method: "GET",
               headers: {
                  'Content-Type': 'application/json'
               },
            })

            // Sending back post data for the searched user
            const postData = await response.json()
            setProfilePostData(postData.profilePostData.reverse() || [])
            // sending back the userdata for the searched user

            setUserProfileData(postData.userData || [])

            setDynamicUsername(postData.userData.user)


         } catch {
            throw new Error("Couldnt fetch for profile data")
         }

         // console.log(profileData)

      }

      getUserProfilePosts()

   }, [userSearched])

   useEffect(()=> {
      console.log(userProfileData)
   }, [userProfileData])



   function addFollower(queryStringUser){
      /*
         * hashed querystring that contains the username that the backend will search for
         * once found, it will display the respective profile page
         * If the queryString matches the loggedIn users name it will know that it is looking
         at the logged in users own page. Therefore, no followbtn will be rendered
       */

      if (queryStringUser === username) {
         return
      }

      // uses the queryString to find the user and add the logged in user to the current list of followers
      async function followUser(queryStringUser){

         const response = await fetch('/addFollowingUser', {
            method: 'POST',
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({followee: queryStringUser, loggedInUser: username})
         })

      }


      function checkFollowing(){
        if (userProfileData.followers?.includes(username)) {
         return <button className="followUserBtn" onClick={()=> followUser(queryStringUser)}>Following <i className="fa-solid fa-check-double"></i></button>
        }

        return <button  className="followUserBtn" onClick={()=> followUser(queryStringUser)}>Follow <i className="fa-solid fa-user-plus"></i></button>

      }

      return checkFollowing()

   }


   function checkUserType(){
      switch (dynamicUsername) {
         // For developers
         case 'Samuel':
            return (
               <>
                  <h2>{dynamicUsername}</h2>
                  <h5 className="profileUserTypeHeader"
                  style={{color: "#00b3ff"}}>
                     Developer <i className="fa-solid fa-code"></i></h5>
               </>
            )
            // for recruiters
         case 'DemoUser':
            return (
               <>
                  <h1>{dynamicUsername}</h1>
                  <h5 className="profileUserTypeHeader" style={{color: "#73ff00"}}>Recruiter <i className="fa-solid fa-clipboard"></i></h5>
               </>
            )
         // For regular users
         default:
            return (
               <>
                  <h1>{dynamicUsername}</h1>
                  <h5 className="profileUserTypeHeader"
                  style={{color: "grey"}}>User <i className="fa-solid fa-user"> </i></h5>
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
                  {addFollower(userSearched)}
               </section>
               <section className="profileSectionInfo">
                  <h3>User Analytics</h3>
                  <br />
                  <div id="showUserStats">
                     <span>
                        <p>{userProfileData.followers?.length || 0}</p>
                        <h4>Followers</h4>
                     </span>
                     <span>
                        <p>{userProfileData.following?.length || 0}</p>
                        <h4>Following</h4>
                     </span>
                  </div>
               </section>
            </div>

            <h2 className="profHeaders">{dynamicUsername}'s Posts</h2>
            <div className="profileAnalytics">

               {profilePostData.map((post)=> {
                  return (
                     <>
                        <article className="existingPost">
                           <h2 className="profilePostSubject">
                              <span>
                                 <i style={{color: 'crimson'}} className="fa-solid fa-bolt"></i>
                                 {" " + post.subject}
                              </span>
                              <div className="profilePostAnalytics">
                                 <h5><i style={{color: "grey"}} className="fa-solid fa-heart"></i> {post.likes.length}</h5>
                                 <h5 style={{color: "grey"}}><i style={{color: "grey"}} className="fa-solid fa-comments"></i> 0</h5>
                              </div>
                           </h2>
                           <h3 className="profilePostSubject">{post.body}</h3>

                        </article>
                     </>
                  )
               })}



            </div>




         </main>
      </>
   )
}