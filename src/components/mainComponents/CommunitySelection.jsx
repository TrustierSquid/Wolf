import { useState, useEffect, useRef } from "react";
import Navbar from "../componentDependencies/NavBar";
import SideNavBar from "../componentDependencies/SideNavbar";
import logo from "/src/assets/wolfLogo.png";
/*
   - Font awesome grid and list icons

   <i className="fa-solid fa-table-cells"></i>
   <i className="fa-solid fa-list"></i>

 */


export default function CommunitySelection(props){
   const userLoggedInUID = props.loggedInUID
   const userLoggedInTopics = props.userTopics
   const updateData = props.updateUserData

   async function leaveCommunity(communityToLeave){
      let response = await fetch(`/removeCommunity/${communityToLeave}/${userLoggedInUID}`, {
         headers: {
            'Content-Type': 'application/json'
         },
         method: 'PUT'
      })

      if (!response.ok) {
         throw new Error("Failed to remove topic from your list");
      }

      updateData()


   }


   return (
      <>
         <Navbar/>
         <SideNavBar/>

         <main id="communityContainer">
            <div id="titleDiv">
               <h1>Your Joined Communities </h1>
               <h4>Communities that you have joined</h4>
            </div>

            <ul>
               {userLoggedInTopics?.length > 0 ? (
                  userLoggedInTopics?.map((community)=> {
                     return (
                        <>
                           <li>
                              <section className="communityInformation">
                                 <img src={logo} alt="" />
                                 <h4>{community}</h4>
                              </section>

                              <section className="interactionBtns">
                                 <button className="viewCommunityPostsBtn" onClick={()=> window.location.href = `/home?topicFeed=${community + 'Feed'}`}>View Posts</button>
                                 <button className="leaveCommunityBtn" onClick={()=> leaveCommunity(community)}>Leave Community</button>
                              </section>

                           </li>
                        </>
                     )
                  })

               ) : (
                  <div className="noPostsMessage">
                     <h3>You have not joined any <a href="/topics" style={{color: 'crimson'}}>communities</a> yet!  </h3>
                  </div>
               )}

            </ul>
         </main>
      </>
   )
}