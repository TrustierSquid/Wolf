import { useState, useEffect, useRef } from "react"
import logo from '/src/assets/wolfLogo.png'
import AboutPost from "../postComponents/AboutPost"
import WolfBotPost from "../postComponents/WolfBotPost"
import Topics from "./Topics"



export default function Home(){
   //  for profile picture
   const profilePictureElement = useRef(null)

   // Each topic that the user selected displayed in the sideNav as individual elements
   const topicBtn = useRef(null)

   // Mobile Nav button that appears at a certain breakpoint
   const mobileNavBtn = useRef(null)

   // The side navigation element
   const sideNav = useRef(null)

   /* DROPDOWN FUNCTIONALITY */
   const profileDropdown = useRef(null)
   const [toggleDropdown, setToggleDropdown] = useState(true)

   // the an array of the topics that the user selected
   const [userData, setUserData] = useState([])

   // Displaying the username of the user in the nav bar
   // and checking user action based off of username
   const [username, setUsername] = useState(null)

   // The topics and 2 facts for each of them
   // Used for wolf bot
   const [topicFact, setTopicFact] = useState([])

   // Whatever topic was selected in the topics list on a users home page, will be processed wolf bot will send info on it
   const [selectedFact, setSelectedFact] = useState(null)

   const likeBtnElement = useRef(null)
   const [likeBtnClicked, setLikeBtnClicked] = useState(true)

   const followBtnElement = useRef(null)
   const [followBtnClicked, setFollowBtnClicked] = useState(true)
   
   const [followerCount, setFollowerCount] = useState(null)
   const [followingCount, setFollowingCount] = useState(null) 

   
   // grabbing poster data for recording likes and follows
   const posterElement = useRef(null)
   const [poster, setPoster] = useState(null)

   const likeCounterElement = useRef(null)
   const [posterTotalLikes, setPosterTotalLikes] = useState(null)

   const currentVersion = 'alpha'
   
   // GETTING USER INFORMATION AND DISPLYING IT ON THE HOME PAGE SPECIFIC TO THE USER LOGGED IN
   useEffect(()=> {
      async function getUserData(){
         const response = await fetch('/users/home', {
            method: 'GET',
            credentials: "include",
            headers: {
               'Content-Type': 'application/json',
            }
         })
   
         if (!response.ok) {
            console.log("Couldn't get user data")
            throw new Error(`HTTP error! status: ${response.status}`);
         }
   
         const homeData = await response.json()

         // setting the user info needed as glob vars
         setUserData(homeData.topicArr)
         setUsername(homeData.userName)
         setFollowerCount(homeData.followerCount)
         setFollowingCount(homeData.followingCount)
         
      }

      getUserData()

   }, [])
   
   // RETRIEVING THE DESCRIPTION THAT COMES WITH EACH TOPIC
   useEffect(()=> {
      async function fetchTopicData(){
         const response = await fetch('/wolfTopics', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            }
         })

         
         const data = await response.json()

         // setting the topic description a glob var 
         setTopicFact(data)
      }

      fetchTopicData()
   }, [])
   
   
   // Mobile nav bar functionality
   function mobileNavFunction() {
      sideNav.current.classList.toggle('toggleNav')
   }

   // Dropdown functionality
   function dropdownFunction() {
      setToggleDropdown(prevState => !prevState)
      
      if (toggleDropdown == true) {
         profileDropdown.current.style.opacity = '1';
         profileDropdown.current.style.pointerEvents = 'all';
         profileDropdown.current.style.transform = 'translateY(10px)';
      } else {
         profileDropdown.current.style.opacity = '0';
         profileDropdown.current.style.pointerEvents = 'none';
         profileDropdown.current.style.transform = 'translateY(0px)';

      }
      
      
   }


   // Helper function to identify the topic you selected
   const handleClick = (topic) => {
      console.log(topic)

      // setting the state for the selected topic
      setSelectedFact(topic)
   }
   

   // CHECKS TO SEE WHAT TOPICS WERE SELECTED ON THE TOPICS PAGE
   // ACCORDING TO WHAT WAS SELECTED, EACH TOPIC WILL RETURN A FACT ABOUT THE RESPECTIVE TOPIC
   function displayTopicInfo(){
      
      switch (selectedFact) {
         case "Sports":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Sports[0].fact1} icon={<i className="fa-solid fa-baseball"></i>}/>
         case "Cosmetology":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Cosmetology[0].fact1} icon={<i className="fa-solid fa-face-smile-beam"></i>}/>
         case "Food":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Food[0].fact1} icon={<i className="fa-solid fa-utensils"></i>}/>
         case "Self care":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Self_Care[0].fact1} icon={<i className="fa-solid fa-person-rays"></i>}/>
         case "Goal Settings":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Goal_Settings[0].fact1} icon={<i className="fa-regular fa-clipboard"></i>}/>
         case "Tech": 
            return <WolfBotPost topic={selectedFact} fact={topicFact.Tech[0].fact1} icon={<i className="fa-solid fa-microchip"></i>}/>
         case "Movies":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Movies[0].fact1} icon={<i className="fa-solid fa-film"></i>}/>
         case "TV":
            return <WolfBotPost topic={selectedFact} fact={topicFact.TV[0].fact1} icon={<i className="fa-solid fa-tv"></i>}/>
         case "Reading":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Reading[0].fact1} icon={<i className="fa-solid fa-book-open-reader"></i>}/>
         case "Filmmaking":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Filmmaking[0].fact1} icon={<i className="fa-solid fa-video"></i>}/>
         case "DIY projects":
            return <WolfBotPost topic={selectedFact} fact={topicFact.DIY_projects[0].fact1} icon={<i className="fa-solid fa-paint-roller"></i>}/>
         case "Dating":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Dating[0].fact1} icon={<i className="fa-solid fa-heart"></i>}/>
         case "Makeup Tutorials":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Makeup_Tutorials[0].fact1} icon={<i className="fa-solid fa-paintbrush"></i>}/>
         case "Environmental Issues":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Environmental_Issues[0].fact1} icon={<i className="fa-solid fa-earth-americas"></i>}/>
         case "Programming":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Programming[0].fact1} icon={<i className="fa-solid fa-code"></i>}/>
         case "Life Hacks":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Life_Hacks[0].fact1} icon={<i className="fa-solid fa-life-ring"></i>}/>
         case "Software":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Software[0].fact1} icon={<i className="fa-brands fa-uncharted"></i>}/>
         case "Computers":
            return <WolfBotPost topic={selectedFact} fact={topicFact.Computers[0].fact1} icon={<i className="fa-solid fa-computer"></i>}/>
         default:
            return
      }

   }

   // Returns the a new post about the app details
   function displayAbout(){
      return (
         <AboutPost appVersion={currentVersion}/>
      )
   }

   // toggle Animation for like button and sending to the server that the user liked a post
   const toggleLike = async ()=> {
      setLikeBtnClicked(prevState => !prevState)
      console.log(`Here is the poster ${posterElement.current.innerText}`)
      console.log(likeBtnClicked)
      const poster = posterElement.current.innerText
      
      if (likeBtnClicked) {
         likeBtnElement.current.style.backgroundColor = '#F96E36'
         likeBtnElement.current.innerHTML = 'Liked <i className="fa-solid fa-thumbs-up"></i>'
         likeBtnElement.current.classList.toggle('.likeBtn')

         try {
            // Sending to the server that the user liked a post
            
            const response = await fetch('/like', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               // if likeBtnClicked is true, it will record it to the database
               body: JSON.stringify({likeCheck: true, whoLiked: username, poster: poster}) 
            })
            
            if (!response.ok) {
               throw new Error(`Response was not okay ${response.status}`)
            }
            
            const data = await response.json()
            console.log(data)
            setPosterTotalLikes(data.totalLikes)

         } catch (err) {
            console.log(err)
         }
         
      } else {
         likeBtnElement.current.style.background = 'none'
         likeBtnElement.current.innerHTML = 'Like <i className="fa-solid fa-thumbs-up"></i>'
         likeBtnElement.current.classList.toggle('.likeBtn')
         
      }
   }

   


   

   


   
   return (
      <>
      {/* NAVBAR */}
         <nav id="nav">
            <div id="logoContainer">
               <img id="logo" src={logo} alt="" />
               <h1>WOLF</h1>
            </div>
            <div id="profileContainer" onClick={()=> dropdownFunction()}>
               <h4 onClick={()=> showProfile()}>
                  <i className="fa-solid fa-user"></i> {username} <i className="fa-solid fa-angle-down"></i></h4>
            </div>
            <button ref={mobileNavBtn} id="mobileNavBtn" onClick={()=> mobileNavFunction()}><i className="fa-solid fa-bars"></i></button>
         </nav>

         <section ref={profileDropdown} id="profileDropdown">
            <div className="profileSection">
               <span id="userAnalyticsContainer">
                  <div id="dataPoint">
                     <h1>{followerCount}</h1>
                     <p>Followers</p>
                  </div>
                  <div id="dataPoint">
                     <h1>{followingCount}</h1>
                     <p>Following</p>
                  </div>
               </span>
            </div>

            <div className="profileSection">
               <h3>Hello, {username}!</h3>
               <button>Log out</button>
            </div>
         </section>

        
      {/* MAIN CONTENT */}

         <main>

            <nav className="sideNav" ref={sideNav}>
               
               <div id="sideNavBtns">
                  <h2 className="subTitle">DashBoard</h2>
                  <button id="homeBtn">Home <i className="fa-solid fa-house"></i></button>
                  <button id="popularBtn">What's Popular<i className="fa-solid fa-fire"></i></button>
                  <button id="newPostBtn">New Post <i className="fa-solid fa-plus"></i></button>

               </div>

               <section className="topicSelectionElement">
                  <h2 className="subTitle">Your Topics</h2>
                  {/* mapping out the selected topics that the user selected */}
                  <div id="selectedTopicsBtns">
                     {/* <button><i className="fa-solid fa-baseball"></i> Sports</button>
                     <button><i className="fa-solid fa-baseball"></i> Skateboarding</button> */}
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

            <section id="content">
               <div id="whatsNew">
                  <h1>What's New</h1>
                  <h2>See What's Hot</h2>
               </div>

               {/* what shows up based on what topics the user selected */}
               <article className="userContent">
                  {/* {displayAbout()} */}
                  {displayTopicInfo()}


                  
                  
                  <div className="userPost">
                     <div className="postAnalytics">
                        <h1 id="poster" ref={posterElement}><img className="profilePicture" src={logo} alt="" />Wolf Bot</h1>
                     </div>
                     <br />
                     <main className="mainPost">
                        <h2 id="postCaption">Hello there! {/* <p id="likeCounter" ref={likeCounterElement}> <i className="fa-solid fa-heart"></i> {posterTotalLikes}</p> */}</h2>
                        <h2 id="postBody">I almost forgot to say, Hello World!</h2>
                        <div className="userTraction">
                           {/* <button className="followBtn" ref={followBtnElement} onClick={()=> {toggleFollow()}}>Follow <i className="fa-solid fa-user-plus"></i></button> */}
                           <button className="likeBtn" ref={likeBtnElement} onClick={()=> {toggleLike()}}>Like <i className="fa-solid fa-thumbs-up"></i></button>
                        </div>
                     </main>
                  </div>
                  
                  
               </article>
            </section>
         </main>

      </>
   )
}