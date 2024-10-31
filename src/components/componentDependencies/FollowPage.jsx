import { useState } from "react";
import Navbar from "./NavBar";
import SideNavBar from "./SideNavbar";

export default function FollowingPageComponent(props) {

   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   const userSearched = urlParams.get("following");
   // const [dynamicUID, setDynamicUID] = useState(null)

   const [dynamicProfilePic, setDynamicProfilePic] = useState(null)

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


   async function unFollowUser(followee){
      // for getting the followee UID
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
   }


   return (
      <>
         <Navbar/>
         <main id="followPageContainer">
            <SideNavBar {...props.sidebarItems}/>
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
               {
                  (queryString.includes('following')) ? (
                     (props.following?.length > 0) ? (
                        props.following?.map((followee, key)=> {
                           return (
                              <>
                                 <div className="followee" key={followee} >
                                    <h4 onClick={()=> {getDynamicProfile(followee)}}>{followee}</h4>
                                    <button id="unfollowBtn" onClick={()=> unFollowUser(followee)}>Unfollow</button>
                                 </div>
                              </>
                           )
                        })
                     ) : (
                        <div className="noPostsMessage">
                           <h3>You aren't following anyone!</h3>
                        </div>
                     )
                  ) : (
                     (props.followers?.length > 0) ? (
                        props.followers?.map((follower, key)=> {
                           return (
                              <>
                                 <div className="followee" key={follower} >
                                    <h4 onClick={()=> {getDynamicProfile(follower)}}>{follower}</h4>
                                 </div>
                              </>
                           )
                        })
                     ) : (
                        <div className="noPostsMessage">
                           <h3>No Followers!</h3>
                        </div>
                     )
                  )

               }
            </section>
         </main>
      </>
   )
}