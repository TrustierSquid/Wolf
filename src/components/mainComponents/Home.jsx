import { useState, useEffect, useRef } from "react"
import logo from '/src/assets/wolfLogo.png'
import AboutPost from "../componentDependencies/AboutPost"
import UpdateFeed from "../componentDependencies/UpdateFeed"
import Navbar from "../componentDependencies/NavBar"
import SideNavBar from "../componentDependencies/SideNavbar"
import FourTopics from "../componentDependencies/FourTopics"


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

   const currentVersion = 'alpha'
   
   const [toggleDropdown, setToggleDropdown] = useState(true)

   // The current user interacting with the app
   // and checking user action based off of username
   const [username, setUsername] = useState(null)


   // the an array of the topics that the user selected
   const [userData, setUserData] = useState([])

   // The topics and 2 facts for each of them
   // Used for wolf bot
   const [topicFact, setTopicFact] = useState([])

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
         
         //  the current users following count
         setFollowingCount(homeData.followingCount.length)
         
         // the current users follower count
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
   function dropdownFunction(element) {
      setToggleDropdown(prevState => !prevState)

      if (element) {
         profileDropdown.current.style.opacity = '0';
         profileDropdown.current.style.pointerEvents = 'none';
         profileDropdown.current.style.transform = 'translateY(0px)';
      } else {

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
   }


   // Helper function to identify the topic you selected
   const handleClick = (topic) => {

      // setting the state for the selected topic
      // setSelectedFact(topic)
      displayTopicInfo(topic)
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


   const navbarRefs = {mobileNavBtn, profileDropdown}
   const sidebarRefs =  {sideNav, topicBtn}

   const navbarProps = {
      logo: logo,
      username: username,
      followerCount: followerCount,
      followingCount: followingCount,

      // Navbar functionality
      dropdownFunction: dropdownFunction,
      logOutFunction: ()=> logOut()
   }

   
   const sidebarProps = {
      userData: userData,

      // sidebar functionality
      handleClick: handleClick, // params being passed through this function 
      displayAbout: ()=> displayAbout()
   }

   
   
   return (
      <>
      
      {/* NAVBAR */}
      <Navbar {...navbarProps} ref={navbarRefs}/>
      <SideNavBar {...sidebarProps} ref={sidebarRefs}/>

      {/* MAIN CONTENT */}

         <main onClick={(element)=> dropdownFunction(element)}>
            <span ref={darkBG} onClick={()=> dissappearEffect()} id="darkBG"></span>
            <section id="content">
               <FourTopics selectedTopics={userData}/>
               <div id="whatsNew">
                  <h1>Home Feed</h1>
                  
                  <button id="newPostBtn" onClick={()=> appearEffect()}>New Post +</button>
                  
                  {/* Floating prompt for creating a new post */}
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
                  <UpdateFeed currentActiveUser={username}/>   {/*  Updating the feed with the newest posts*/}
                  
               </article>
            </section>
         </main>

      </>
   )
}