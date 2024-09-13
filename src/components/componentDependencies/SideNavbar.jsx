import { forwardRef, useEffect, useRef } from "react"

const SideNavBar = forwardRef(({
   userData,
   displayAbout
}, ref) => {
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
            <br />
            <section className="topicSelectionElement">
               <button onClick={()=> navigateToHome()}>Home Feed <i className="fa-solid fa-house"></i></button>
               <button onClick={()=> navigateToTopicSelection()}>Join Topic <i className="fa-solid fa-person-circle-plus"></i></button>

               <h4 className="subTitle">JOINED TOPICS</h4>

               {/* mapping out the selected topics that the user selected */}
               <div id="selectedTopicsBtns">
                  {userData.map(topic => {
                     //
                     return (
                        <>
                           <button ref={topicBtn} onClick={()=> navigateToFeed(topic)}>{topic}<i className="fa-solid fa-person-walking-arrow-right"></i></button>
                        </>
                     )
                  })}
               </div>
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