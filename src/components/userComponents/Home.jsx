import { useState, useEffect, useRef } from "react"
import logo from '/src/assets/wolfLogo.png'



export default function Home(){
   const profilePictureElement = useRef(null)
   const topicBtn = useRef(null)
   const mobileNavBtn = useRef(null)
   const sideNav = useRef(null)
   const [userData, setUserData] = useState([])
   const [username, setUsername] = useState(null)


   useEffect(()=> {
      async function getUserData(){
         const response = await fetch('/users/home', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            }
         })
   
         if (!response.ok) {
            console.log("Couldn't get user data")
            throw new Error(`HTTP error! status: ${response.status}`);
         }
   
         const homeData = await response.json()
         console.table(homeData)
         setUserData(homeData.topicArr)
         setUsername(homeData.userName)
      }

      getUserData()
   }, [])
   
   


   function mobileNavFunction() {
      sideNav.current.classList.toggle('toggleNav')
   }
   
   
   return (
      <>
      {/* NAVBAR */}
         <nav id="nav">
            <div id="logoContainer">
               <img id="logo" src={logo} alt="" />
               <h1>WOLF</h1>
            </div>
            <div id="profileContainer">
               <img className="profilePicture" ref={profilePictureElement} src="" alt="" />
               <h2>{username}</h2>
            </div>
            <button ref={mobileNavBtn} id="mobileNavBtn" onClick={()=> mobileNavFunction()}><i className="fa-solid fa-bars"></i></button>
         </nav>

      {/* MAIN CONTENT */}

         <main>


            <nav className="sideNav" ref={sideNav}>
               <div id="sideNavBtns">
                  <button id="homeBtn">Home <i className="fa-solid fa-house"></i></button>
                  <button id="popularBtn">Popular <i className="fa-solid fa-fire"></i></button>
                  <button id="newPostBtn">New Post</button>

               </div>

               <section className="topicSelectionElement">
                  <h3 className="subTitle">Your Topics</h3>
                  {/* mapping out the selected topics that the user selected */}
                  <div id="selectedTopicsBtns">
                     {/* <button><i className="fa-solid fa-baseball"></i> Sports</button>
                     <button><i className="fa-solid fa-baseball"></i> Skateboarding</button> */}
                     {userData.map(topic => {
                        // 
                        return (
                           <>
                              <button ref={topicBtn}>{topic} <i className="fa-solid fa-person-walking-arrow-right"></i></button>
                           </>
                        )
                     })}
                  </div>
               </section>

               <section className="topicSelectionElement">
                  <h3 className="subTitle">Other Resources</h3>
                  {/* mapping out the selected topics that the user selected */}
                  <div id="OtherResourcesBtns">
                     <button>About <i className="fa-solid fa-book"></i></button>
                     <button>More Topics<i className="fa-solid fa-magnifying-glass-plus"></i></button>
                  </div>
               </section>
            </nav>


            <section id="content">
               <div id="whatsNew">
                  <h1>Whats New</h1>
               </div>

               {/* what shows up based on what topics the user selected */}
               <article id="userContent">

                  <div className="userPost">
                     <h1><img className="profilePicture" src={logo} alt="" />{"Wolf Bot"} posted</h1>
                     <br />
                     <main className="mainPost">
                        <h2 id="postCaption">Hello there!</h2>
                        <h2 id="postBody">I almost forgot to say, Hello World!</h2>

                     </main>
                  </div>
                  {/* <div className="userPost">
                     <h1><img className="profilePicture" src={logo} alt="" />{"Wolf Bot"} posted</h1>
                     <br />
                     <main className="mainPost">
                        <h2 id="postCaption">Greetings!</h2>
                        <h2 id="postBody">Wonderful day!</h2>

                     </main>
                  </div> */}
               </article>
            </section>
         </main>

      </>
   )
}