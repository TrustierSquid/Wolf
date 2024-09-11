import { forwardRef, useEffect, useRef } from "react"

const SideNavBar = forwardRef(({
   userData,
   displayAbout
}, ref) => {
   const {sideNav, topicBtn} = ref || {}

   useEffect(()=> {
      async function loadTopicFeed(topic){
         const response = await fetch(`/loadTopicFeed?topicFeed=${topic}`, {
            method: "GET",
            headers: {
               'Content-Type': 'application/json'
            }
         })

         const data = response.json()
      }
   }, [])

   function navigateToFeed(topic){
      window.location.href = `/home?topicFeed=${topic + 'Feed'}`
   }

   function navigateToHome(){
      window.location.href = `/home`
   }


   return (
      <>
         <nav className="sideNav" ref={sideNav}>
            <br />
            <section className="topicSelectionElement">
               <button onClick={()=> navigateToHome()}>Home Feed</button>

               <h4 className="subTitle">YOUR TOPICS</h4>

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