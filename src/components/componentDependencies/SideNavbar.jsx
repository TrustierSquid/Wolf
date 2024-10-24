import { forwardRef, useEffect, useRef } from "react"

const SideNavBar = forwardRef(({
   // loggedIn topics
   username,
   followers,
   followings
}, props, ref) => {
   const {sideNav, topicBtn} = ref || {}


   /* useEffect(()=> {
      async function loadTopicFeed(topic){
         const response = await fetch(`/loadTopicFeed?topicFeed=${topic}`, {
            method: "GET",
            headers: {
               'Content-Type': 'application/json'
            }
         })

         const data = response.json()
      }
   }, []) */

   // Goes to the feed determined in the query string
   function navigateToFeed(topic){
      window.location.href = `/home?topicFeed=${topic + 'Feed'}`
   }

   // if there is no query string when navigating feeds, then it will default to home
   function navigateToHome(){
      window.location.href = `/home`
   }

   function navigateToTopicSelection(){
      window.location.href = `/topics`
   }



   return (
      <>
         <nav className="sideNav" ref={sideNav}>
            <section id="subTitle">
               <h3 id="sidebarUsername">
                  {username}
                  {
                     (username === 'Samuel') ? (
                        <>
                           <span style={{color: 'turquoise'}}>Developer</span>
                        </>
                     ) : (
                        <>
                           <span>User</span>
                        </>
                     )
                  }
               </h3>
               <div id="followingCountContainer">
                  <div className='followingContainerItem'>
                     <h2>{followings}</h2>
                     <p>Following</p>
                  </div>
                  <div className='followingContainerItem'>
                     <h2>{followers}</h2>
                     <p>Followers</p>
                  </div>
               </div>
            </section>
            <br />
            <section className="topicSelectionElement">
               <button onClick={()=> window.location.href = '/communities'}><i className="fa-solid fa-border-all"></i> My Communities </button>
               <button onClick={()=> window.location.href = '/topics'}><i className="fa-solid fa-plus"></i> Join a Community</button>
               <button><i className="fa-solid fa-right-from-bracket"></i>Logout</button>

               {/* <h4 className="subTitle">JOINED COMMUNITIES</h4> */}

               {/* mapping out the selected topics that the user selected */}
               {/* <div id="selectedTopicsBtns">
                  {userData?.length > 0 ? (
                     userData.map((topic, key) => {
                        return (
                           <>
                              <button key={key} ref={topicBtn} onClick={()=> navigateToFeed(topic)}><i className="fa-solid fa-person-walking-arrow-right"></i>{topic}</button>
                           </>
                        );
                     })

                  ) : (
                     <div className="noTopicsMessage">
                        <h3>No Topics Available</h3>
                        <p>Start joining topics to see them here.</p>
                     </div>
                  )}
               </div> */}
            </section>






            {/* <section className="topicSelectionElement">
               <h2 className="subTitle">Other Resources</h2>
               mapping out the selected topics that the user selected
               <div id="OtherResourcesBtns">

               </div>
            </section> */}

         </nav>
      </>
   )
})


export default SideNavBar