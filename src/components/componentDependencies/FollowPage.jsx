import { useEffect, useState, useRef } from "react";
import Navbar from "./NavBar";
import SideNavBar from "./SideNavbar";
import defaultProfilePic from '/src/assets/defaultUser.png';

export default function FollowingPageComponent(props) {

   // Crucial for looking up followers based on the queryString
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   const userSearched = urlParams.get("following") ? urlParams.get('following') : urlParams.get('followers');

   const [dynamicUID, setDynamicUID] = useState(null)
   const [dynamicFollowingData, setDynamicFollowingData] = useState(null)
   const [dynamicFollowers, setDynamicFollowers] = useState(null)
   const [dynamicUsername, setDynamicUsername] = useState(null)
   const [dynamicProfilePic, setDynamicProfilePic] = useState(null)
   const unfollowBtnRef = useRef(null)

   async function getDynamicProfile(user){
      let response = await fetch(`/dynamic/${user}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      })

      let data = await response.json()


      window.location.href = `/profile?user=${data?.dynamicUID}`;  // Use the fetched UID

   }

   async function getDynamicUID(user){
      /*
         for getting the followee UID.
         When the follow page is loaded depending on who is searched, this will look up the following list -
         for the searched user
       */

      let response = await fetch(`/dynamicUID/${userSearched}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      })

      let data = await response.json()
      setDynamicUID(data.dynamicUID)
      // setDynamicFollowers(data.dynamicFollowers)
      // setDynamicFollowing(data.dynamicFollowingData)
      setDynamicUsername(data.dynamicUsername)


   }

   async function getFollowerInformation(){
      // for the following page
      try {
         let response = await fetch(`/dynamicFollowers/${userSearched}`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json'
            }
         })

         let data = await response.json()
         setDynamicFollowingData(data)

      } catch {
         console.log("Can't load photos")
      }

   }


   // Unfollowing a user
   async function unFollowUser(followee){
      // for getting the followee UID
      // Searching by username
      let responseDynamic = await fetch(`/dynamic/${followee}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      })

      let data = await responseDynamic.json()

      // unfollow transaction
      let response = await fetch('/addFollowingUser', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({followee: data.dynamicUID, loggedInUser: props.loggedInUID})
      })

      props.updateUserData()
      unfollowBtnRef.current.innerHTML = '<i class="fa-solid fa-check"></i>'
      unfollowBtnRef.current.style.pointerEvents = 'none'
   }

   useEffect(()=> {
      getDynamicUID()
      getFollowerInformation()
   }, [])



   return (
      <>
         <Navbar/>
         <SideNavBar {...props.sidebarItems}/>
         <main id="followPageContainer">
            <section id="displayFollowingContainer">
               {(queryString.includes('following')) ? (
                  <>
                     <h2>Following</h2>
                  </>
               ) : (
                  <>
                     <h2>Followers</h2>
                  </>
               )}
               {(queryString.includes('following')) ? (
                  (dynamicFollowingData) ? (
                     <>
                        {
                           (dynamicFollowingData?.following.length > 0) ? (
                              dynamicFollowingData?.following.map((followee, key)=> {
                                 return (
                                    <>
                                       <div className="followee" key={followee} >
                                          <h4 onClick={()=> {getDynamicProfile(followee.searchedFollowerUsername)}}>
                                             <img className='followerProfilePic' src={followee.searchedFollowerProfilePic ? followee.searchedFollowerProfilePic : defaultProfilePic }></img>
                                             {followee.searchedFollowerUsername}</h4>

                                             {/* Fixes duplicate unfollow buttons on the loggedin user */}
                                             {followee.searchedFollowerUsername === props.username ? (
                                                   <span></span>
                                                ) : (
                                                   <button id="unfollowBtn" onClick={()=> unFollowUser(followee.searchedFollowerUsername)} ref={unfollowBtnRef}>Unfollow</button>
                                                )
                                             }
                                       </div>
                                    </>
                                 )
                              }
                           )
                           // if the user isnt following anyone
                           ) : (
                              <div className="noPostsMessage">
                                 { (dynamicUsername === props.username) ? (
                                       <h3>You aren't following anyone!</h3>
                                    ) : (
                                       <h3>{dynamicUsername} isn't following anyone</h3>
                                    )
                                 }
                              </div>
                           )
                        }
                     </>
                     // Loader
                  ) : (
                     <div className="noPostsMessage">
                        <div className=' loader '>
                        </div>
                     </div>
                  )

                  ) : (
                     <>
                        {
                           // For followers
                           (dynamicFollowingData) ? (
                              <>
                                 {(dynamicFollowingData?.followers.length > 0) ? (
                                    dynamicFollowingData?.followers.map((follower, key)=> {
                                       return (
                                          <>
                                             <div className="followee" key={follower} >
                                                <h4 onClick={()=> {getDynamicProfile(follower.searchedFollowerUsername)}}>
                                                   <img className='followerProfilePic' src={follower.searchedFollowerProfilePic ? follower.searchedFollowerProfilePic : defaultProfilePic} alt="" />
                                                   {follower.searchedFollowerUsername}</h4>
                                             </div>
                                          </>
                                       )
                                    })
                                 ) : (
                                    <div className="noPostsMessage">
                                       <h3>No Followers!</h3>
                                    </div>
                                 )}
                              </>
                           ) : (
                              <div className="noPostsMessage">
                                 <div className=' loader '>
                                 </div>
                              </div>
                           )
                        }
                     </>
                  )

               }
            </section>
         </main>
      </>
   )
}