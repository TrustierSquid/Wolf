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
         const response = await fetch(`/users/homeFeed`, {
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



   // WHEN THE USER CREATES A NEW POST
   const subjectPostElement = useRef(null)
   const bodyPostElement = useRef(null)
   const [errorMessage, setErrorMessage] = useState('')
   const errorMessageElement = useRef(null)

   const [grippedFeed, setGrippedFeed] = useState([])

   // selected topic will default to main
   const [grippedTopic, setGrippedTopic] = useState("Main")

   //  Creating a new post and sending it to the db so it can be displayed
   async function createNewPost(){
      let subject = subjectPostElement.current.value
      let body = bodyPostElement.current.value

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString)
      const userSearched = urlParams.get('topicFeed')

      // checking to see if either input field is empty
      if (!subject || !body) {
         setErrorMessage('Please Enter a subject and body')
         console.log(grippedTopic)
         return
      }

      setErrorMessage('Posting..')

      if (!queryString) {
         // Sending post to db...
         const response = await fetch(`/newPost?feed=mainFeed`, {
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

         setTimeout(() => {
            // setErrorMessage('')
            window.location.reload()
         }, 3000);

      } else {

         // Sending post to db...
         const response = await fetch(`/newPost?feed=${userSearched}`, {
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

         setTimeout(() => {
            // setErrorMessage('')
            window.location.reload()
         }, 1000);

      }

   }



   // fourTopics inits this function
   function changeTopicFeed(element, topicName) {
      // element is any one of the 4 items in the home grid
      async function selectGridTopic() {
         const response = await fetch(`/update?topic=${topicName}`, {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
           },
         });

         if (!response.ok) {
           throw new Error(`Couldnt update the feed! ${response.status}`)
         }

         // returning the feed to be displayed to the user
         const feed = await response.json();


         // THESE STATES GET PASSED INTO THE UPDATE FEED COMPONENT
         // gets the feed associated with the topic selected
         setGrippedFeed(feed)

         // the selected topics that are clicked on in the grid
         setGrippedTopic(topicName)
         console.log(grippedTopic)
       }

       selectGridTopic();

   }

   // Mobile nav bar functionality
   function mobileNavFunction() {
      sideNav.current.classList.toggle('toggleNav')
   }


   // Returns the a new post about the app details
   function displayAbout(){
      return (
         <AboutPost appVersion={currentVersion}/>
      )
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

   // for making the comments section appear and disappear
   function appearEffectComments() {
      if (commentInterface) {
         darkBG.current.style.opacity = '1'
         darkBG.current.style.pointerEvents = 'all'
         document.body.style.overflow = 'hidden';
      }
   }

   function removeEffect(){
      darkBG.current.style.opacity = '0'
      darkBG.current.style.pointerEvents = 'none'
      document.body.style.overflow = 'auto';
   }

   function clearOut() {
      profileDropdown.current.style.opacity = '0';
      profileDropdown.current.style.pointerEvents = 'none';
      profileDropdown.current.style.transform = 'translateY(0px)';
      darkBG.current.style.opacity = '0'
      darkBG.current.style.pointerEvents = 'none'
      createPostElement.current.style.opacity = '0'
      createPostElement.current.style.pointerEvents = 'none'
      bodyPostElement.current.value = ''
      subjectPostElement.current.value = ''
      document.body.style.overflow = 'auto';
   }


   const sidebarRefs =  {sideNav, topicBtn}

   // Navbar functionality
   const navbarProps = {
      logo: logo,
      username: username,
      mobileNavFunction: ()=> mobileNavFunction()
   }


   // sidebar functionality
   const sidebarProps = {
      userData: userData,
      displayAbout: ()=> displayAbout()
   }

   // determining what feed the user is looking at
   const createPostMessage = ()=> {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const userSearched = urlParams.get("topicFeed");

      if (!queryString) {
         return `Create Post on Home +`
      }

      let splicedTopic = userSearched.split("Feed")
      return  `Create Post On ${splicedTopic[0]} +`
   }

   return (
      <>

      {/* NAVBAR */}
      <Navbar {...navbarProps}/>
      <SideNavBar {...sidebarProps} ref={sidebarRefs}/>

      {/* MAIN CONTENT */}

         <main>
            <span ref={darkBG} id="darkBG"></span>
            <section id="content">
               <FourTopics selectedTopics={userData} changeTopic={changeTopicFeed}/>

               <div id="whatsNew">

                  <span id="newPostBtn" onClick={()=> appearEffect()}>{createPostMessage()}</span>

                  {/* Floating prompt for creating a new post */}
                  <form ref={createPostElement} id="createPostElement" >
                     <h2 id="createNewPostHeader">Create New Post <span onClick={()=> dissappearEffect()}>Back <i className="fa-solid fa-arrow-right"></i></span></h2>
                     <div id="formSubject">
                        <label>Post Subject</label><br />
                        <textarea maxLength={40} required placeholder='Enter a Post Subject' onsubmit="return false" ref={subjectPostElement}></textarea><br />
                     </div>
                     <br />
                     <div id="formBody">
                        <label>Post Body</label><br />
                        <textarea required placeholder='Enter a Post Body' onsubmit="return false" ref={bodyPostElement}type="text"></textarea>
                     </div>
                     <br />
                     <h4 id="feedbackMessage" ref={errorMessageElement}>{errorMessage}</h4>
                     <button type='button' onClick={()=> createNewPost()}>Post</button>
                  </form>
               </div>

               {/* what shows up based on what topics the user selected */}
               <article className="userContent">
                  {/* changingFeed will be the dependant topic of the user feed*/}
                  <UpdateFeed currentActiveUser={username} selectedfeed={grippedFeed} topicDisplay={grippedTopic} bgEffect={appearEffectComments} removeBGEffect={removeEffect} />   {/*  Updating the feed with the newest posts*/}

               </article>
            </section>
         </main>

      </>
   )
}