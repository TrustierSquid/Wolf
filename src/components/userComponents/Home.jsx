import { useState, useEffect, useRef } from "react"
import logo from '/src/assets/wolfLogo.png'


export default function Home(){
   const profilePictureElement = useRef(null)

   function Nav(){
      return (
         <>
            <nav id="nav">
               <img id="logo" src={logo} alt="" />
               <img id="profilePicture" ref={profilePictureElement} src="" alt="" />
            </nav>
         </>
      )

   }
   
   
   return (
      <>
      {/* NAVBAR */}
         {Nav()}

      {/* MAIN CONTENT */}

         <main>
            <nav id="sideNav">
               <div id="sideNavBtn">
                  <button id="homeBtn"><i class="fa-solid fa-house"></i> Home</button>
                  <button id="popularBtn"><i class="fa-solid fa-fire"></i> Popular</button>
               </div>

               <section className="topicSelectionElement">
                  <h3 className="subTitle">Your Topics</h3>
                  {/* mapping out the selected topics that the user selected */}
                  <div id="selectedTopicsBtns">
                     <button><i className="fa-solid fa-baseball"></i> Sports</button>
                     <button><i className="fa-solid fa-baseball"></i> Skateboarding</button>
                  </div>
               </section>

               <section className="topicSelectionElement">
                  <h3 className="subTitle">Other Resources</h3>
                  {/* mapping out the selected topics that the user selected */}
                  <div id="OtherResourcesBtns">
                     <button><i class="fa-solid fa-book"></i> About</button>
                     <button><i class="fa-solid fa-magnifying-glass-plus"></i> More Topics</button>
                  </div>
               </section>

            </nav>
            <section id="content">
               <div id="whatsNew">
                  <h1>Whats New</h1>
                  <button id="newPostBtn">New Post +</button>
               </div>

               {/* what shows up based on what topics the user selected */}
               <article id="userContent">

                  {/* Who posted */}
                  <div id="whoPosted">
                     <img src={logo} alt="" />
                     <h3>Wolf Bot just posted x ago</h3>
                  </div>

                  {/* Subject and Content of the post */}
                  <div id="postContent">
                     <div className="content-section">
                        <h5>SUBJECT</h5>
                        <h2 >Greetings! I am Wolf Bot!</h2>
                     </div>
                     <div className="content-section">
                        <h5>BODY</h5>
                        <p>I almost forgot to say Hello World!</p>
                     </div>
                  </div>

                  {/* Likes and comments btns */}
                  <div id="postAnalytics">
                     <button id="likeBtn"><i class="fa-regular fa-heart"></i></button>
                     <button id="likeBtn"><i class="fa-regular fa-comment"></i></button>
                  </div>

                  {/* Listing comments from other users */}
                  <div id="comments">
                     <h2>Comments</h2>
                     
                     <div id="postComment">
                        <input type="text" placeholder="Add a Comment.."/>
                        <button id="postCommentBtn">Post</button>
                     </div>
                  </div>
               </article>
            </section>
         </main>

      </>
   )
}