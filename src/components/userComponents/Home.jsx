import { useState, useEffect, useRef } from "react"
import logo from '/src/assets/wolfLogo.png'
import AboutPost from "../postComponents/AboutPost"
import WolfBotPost from "../postComponents/WolfBotPost"
import UpdateFeed from "../UpdateFeed"
import Navbar from "../postComponents/NavBar"


export default function Home(){
   // Each topic that the user selected displayed in the sideNav as individual elements
   const topicBtn = useRef(null)

   // Mobile Nav button that appears at a certain breakpoint
   const mobileNavBtn = useRef(null)

   // The side navigation element
   const sideNav = useRef(null)

   // grabbing poster data for recording likes and follows
   const posterElement = useRef(null)

   /* DROPDOWN FUNCTIONALITY */
   const profileDropdown = useRef(null)
   const [toggleDropdown, setToggleDropdown] = useState(true)

   // the an array of the topics that the user selected
   const [userData, setUserData] = useState([])

   // The current user interacting with the app
   // and checking user action based off of username
   const [username, setUsername] = useState(null)

   // The topics and 2 facts for each of them
   // Used for wolf bot
   const [topicFact, setTopicFact] = useState([])

   // Whatever topic was selected in the topics list on a users home page, will be processed wolf bot will send info on it
   const [selectedFact, setSelectedFact] = useState(null)


   const currentVersion = 'alpha'

   const [followerCount, setFollowerCount] = useState([])
   const [followingCount, setFollowingCount] = useState([])


   // GETTING USER INFORMATION AND DISPLYING IT ON THE HOME PAGE SPECIFIC TO THE USER LOGGED IN
   useEffect(()=> {
      async function getUserData(){
         const response = await fetch(`/users/home`, {
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
         // console.log(homeData.followingCount.length)
         // setting the user info needed as glob vars
         
         // the topics the current user selected
         setUserData(homeData.topicArr)
         
         // the current user logged in
         setUsername(homeData.userName)
         
         // the current users follower count
         // setFollowerCount(homeData.followerCount.length)

         
         //  the current users following count
         setFollowingCount(homeData.followingCount.length)

         setFollowerCount(homeData.followerCount.length)

         
      }
      
      getUserData()
      
   }, [])   
   
   // RETRIEVING THE DESCRIPTION THAT COMES WITH EACH TOPIC
   useEffect(()=> {
      async function fetchTopicData(){
         const response = await fetch(`/wolfTopics`, {
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
      
      if (profileDropdown.current) {
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
      
      
      
   }


   // Helper function to identify the topic you selected
   const handleClick = (topic) => {
      console.log(topic)

      // setting the state for the selected topic
      setSelectedFact(topic)
      seeLatestPost()
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



   // WHEN THE USER CREATES A NEW POST
   const subjectPostElement = useRef(null)
   const bodyPostElement = useRef(null)
   const [errorMessage, setErrorMessage] = useState('')
   const errorMessageElement = useRef(null)
   
   //  Creating a new post and sending it to the db so it can be displayed
   async function createNewPost(){
      let subject = subjectPostElement.current.value
      let body = bodyPostElement.current.value


      // checking to see if either input field is empty
      if (!subject || !body) {
         setErrorMessage('Please Enter a subject and body')
         return 
      } 

      setErrorMessage('Posting..')
            
      // Sending post to db...
      const response = await fetch(`/newPost`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({whoPosted: username, postSubject: subject, postBody: body})
      })

      if (!response.ok) {
         throw new Error(`Error posting.. ${response.status}`)
      } 

      setTimeout(()=> {
         errorMessageElement.current.style.color = 'lime'
         bodyPostElement.current.value = ''
         subjectPostElement.current.value = ''
         setErrorMessage('Posted!')
      }, 900)

      
   }

   

   const createPostElement = useRef(null)
   const darkBG = useRef(null)

   // FOR THE APPEARING AND DISAPPEARING POST CREATING SCREEN
   function appearEffect() {
      // toggling wether it appears or not
      if(createPostElement) {         
         darkBG.current.style.opacity = '1'
         darkBG.current.style.pointerEvents = 'all'
         createPostElement.current.style.opacity = '1'
         createPostElement.current.style.pointerEvents = 'all'
         bodyPostElement.current.value = ''
         subjectPostElement.current.value = ''
         document.body.style.overflow = 'hidden';
      }
      
   }

   function dissappearEffect(){
      darkBG.current.style.opacity = '0'
      darkBG.current.style.pointerEvents = 'none'
      createPostElement.current.style.opacity = '0'
      createPostElement.current.style.pointerEvents = 'none'
      bodyPostElement.current.value = ''
      subjectPostElement.current.value = ''
      document.body.style.overflow = 'auto';
   }


   function logOut(){
      window.location.href = '/'
   }

   function viewProfile() {
      console.log("Viewing profile")
      window.location.href = '/viewProf'
   }

   const props = {
      logo: logo,
      username: username,
      followerCount: followerCount,
      followingCount: followingCount,

      dropdownFunction: ()=> dropdownFunction(),
      viewProfileFunction: ()=> viewProfile(),
      logOutFunction: ()=> logOut()
   }

   const refs = {mobileNavBtn, profileDropdown}
   
   return (
      <>
      
      {/* NAVBAR */}
      <Navbar {...props} ref={refs}/>


         {/* <nav id="nav">
            <div id="logoContainer">
               <img id="logo" src={logo} alt="" />
               <h1>WOLF</h1>
            </div>
            <div id="profileContainer" onClick={()=> dropdownFunction()}>
               <h4>
               <i class="fa-solid fa-user-gear"></i> {username} <i className="fa-solid fa-angle-down"></i></h4>
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
               <button onClick={()=> viewProfile()}>View profile</button>
               <button onClick={()=> logOut()}>Log out</button>
            </div>
         </section> */}

         <nav className="sideNav" ref={sideNav}>
            
            <div id="sideNavBtns">
               <button id="homeBtn">Home <i className="fa-solid fa-house"></i></button>
               <button id="popularBtn">What's Popular<i className="fa-solid fa-fire"></i></button>
               
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
        
      {/* MAIN CONTENT */}

         <main>
            <span ref={darkBG} onClick={()=> dissappearEffect()} id="darkBG"></span>


         
            <section id="content">
               <div id="whatsNew">
                  <h1>Home Feed</h1>
                  
                  <button id="newPostBtn" onClick={()=> appearEffect()}>New Post +</button>
                  
                  
                  <form ref={createPostElement} id="createPostElement" >
                     <h2 id="createNewPostHeader">Create a new Post</h2>
                     <div id="formSubject">
                        <label>Post Subject</label><br />
                        <input required placeholder='Enter a Post Subject' onsubmit="return false" ref={subjectPostElement} type="text" /><br />
                     </div>
                     <br />
                     <div id="formBody">
                        <label>Post Body</label><br />
                        <input required placeholder='Enter a Post Body' onsubmit="return false" ref={bodyPostElement}type="text" />
                     </div>
                     <br />
                     <button type='button' onClick={()=> createNewPost()}>Post</button>
                     <h4 id="feedbackMessage" ref={errorMessageElement}>{errorMessage}</h4>
                  </form>   
               </div>

               {/* what shows up based on what topics the user selected */}
               <article className="userContent">
                  {displayTopicInfo()} {/*  adding wolf bots message about the respective topic the user selects   */}
                  <UpdateFeed currentActiveUser={username}/>   {/*  Updating the feed with the newest posts*/}
                  
               </article>
            </section>
         </main>

      </>
   )
}