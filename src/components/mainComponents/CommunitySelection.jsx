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

   const [totalMembers, setTotalMembers] = useState(null)

  async function checkMembers() {
    let response = await fetch('/community/checkMembers', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({currentlyJoinedTopics: userLoggedInTopics})
    })

    const memberData = await response.json()

    setTotalMembers(memberData)

  }
  useEffect(() => {
     checkMembers()
   }, [])

   // console.log(totalMembers)

   async function leaveCommunity(communityToLeave){
      let response = await fetch(`/removeCommunity/${communityToLeave}/${userLoggedInUID}/${props.username}`, {
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

   function displayMembers(){
      // checking specific member counts





   }

   // displayMembers()

   return (
      <>
         <Navbar/>

         <div id="contentContainer">
            <SideNavBar {...props.sidebarItems}/>
            <main id="communityContainer">
               <div id="titleDiv">
                  <h1>Your Communities </h1>
                  <h4>Communities that you are apart of</h4>
               </div>

               <ul>
                  {userLoggedInTopics?.length > 0 ? (
                     userLoggedInTopics?.map((community, key)=> {
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
                        <h3>You have not Joined any <a href="/topics" style={{color: 'crimson'}}>communities!</a>  </h3>
                     </div>
                  )}

               </ul>
            </main>
         </div>

      </>
   )
}