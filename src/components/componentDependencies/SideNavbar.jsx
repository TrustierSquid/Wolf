import { forwardRef, useRef } from "react"

const SideNavBar = forwardRef(({
   userData,
   logOut,
   displayAbout
}, ref) => {

   const {sideNav, topicBtn} = ref || {}

   return (
      <>
         <nav className="sideNav" ref={sideNav}>

            <div id="sideNavBtns">
               <button id="homeBtn">Main Feed <i className="fa-solid fa-fire"></i></button>
               <button onClick={()=> logOut()}>Log out <i className="fa-solid fa-right-from-bracket"></i></button>
            </div>


            <section className="topicSelectionElement">
               <h2 className="subTitle">Your Topics</h2>

               {/* mapping out the selected topics that the user selected */}
               <div id="selectedTopicsBtns">
                  {userData.map(topic => {
                     //
                     return (
                        <>
                           <button ref={topicBtn}>{topic}<i className="fa-solid fa-person-walking-arrow-right"></i></button>
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