import { forwardRef, useRef } from "react"

const SideNavBar = (({
   userData,
   handleClick,
   displayAbout
}, ref) => {
   
   const {sideNav, topicBtn} = ref || {}

   return (
      <>
         <nav className="sideNav" ref={sideNav}>
            
            <div id="sideNavBtns">
               <button id="homeBtn">Home <i className="fa-solid fa-house"></i></button>
               <button id="popularBtn">What's Popular<i className="fa-solid fa-fire"></i></button>
               
            </div>


            <section className="topicSelectionElement">
               <h2 className="subTitle">Your Topics</h2>
               
               {/* mapping out the selected topics that the user selected */}
               <div id="selectedTopicsBtns">
                  {userData.map(topic => {
                     // 
                     return (
                        <>
                           <button ref={topicBtn} onClick={()=> handleClick(topic)}>{topic}<i className="fa-solid fa-person-walking-arrow-right"></i></button>
                        </>
                     )
                  })}
               </div>
            </section>

            <section className="topicSelectionElement">
               <h2 className="subTitle">Other Resources</h2>
               {/* mapping out the selected topics that the user selected */}
               <div id="OtherResourcesBtns">
                  <button onClick={()=> displayAbout()}>About <i className="fa-solid fa-book"></i></button>
                  <button>More Topics<i className="fa-solid fa-magnifying-glass-plus"></i></button>
               </div>
            </section>

         </nav>
      </>
   )
})


export default SideNavBar