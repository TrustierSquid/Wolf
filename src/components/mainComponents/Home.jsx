import { useState, useEffect, useRef } from "react"
import logo from '/src/assets/wolfLogo.png'
import AboutPost from "../componentDependencies/AboutPost"
import UpdateFeed from "../componentDependencies/UpdateFeed"
import Navbar from "../componentDependencies/NavBar"
import SideNavBar from "../componentDependencies/SideNavbar"

/*
- For getting the query string
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
const userSearched = urlParams.get('topicFeed')
 */


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
         // console.log(homeData.topicArr)

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

   const [communityStatePost, setCommunityStatePost] = useState('Home')


   let postToCommunity = (communityToPostTo) => {
      /*
         When the user selects a comunity to post to,
         the state variable will change to the respective community
       */
      setCommunityStatePost(communityToPostTo)
   }


   // WHEN THE USER CREATES A NEW POST
   const subjectPostElement = useRef(null)
   const bodyPostElement = useRef(null)
   const [errorMessage, setErrorMessage] = useState('')
   const errorMessageElement = useRef(null)

   const [grippedFeed, setGrippedFeed] = useState([])

   // selected topic will default to main
   const [grippedTopic, setGrippedTopic] = useState("Main")

   // image upload element
   const imageRef = useRef(null)

   //  Creating a new post and sending it to the db so it can be displayed
   async function createNewPost(){
      let subject = subjectPostElement.current.value
      let body = bodyPostElement.current.value

      // handling to see if either input field is empty
      if (!subject || !body) {
         setErrorMessage('Please Enter a subject and body')
         return
      }

      // checking to see what community the user is posting to
      console.log(
         {
            community: communityStatePost,
            subject: subject,
            body: body,
            sender: username
         }
      )


      // Sending post to db...
      const responseForPost = await fetch(`/newPost?feed=${communityStatePost}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
          },
         body: JSON.stringify({whoPosted: username, postSubject: subject, postBody: body})
      })

      if (!responseForPost.ok) {
         throw new Error(`Error posting.. ${responseForPost.status}`)
      }

      // Message to confirm that the post has been to the respective feed
      setTimeout(()=> {
         errorMessageElement.current.style.color = 'lime'
         bodyPostElement.current.value = ''
         subjectPostElement.current.value = ''
         setErrorMessage(`Posted to ${communityStatePost}`)
      }, 900)


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
   const newPostBtn = useRef(null)
   const newPostBtnMobile = useRef(null)

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
         newPostBtnMobile.current.style.opacity = '0'
         newPostBtnMobile.current.style.pointerEvents = 'none'
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
      newPostBtnMobile.current.style.opacity = '1'
      newPostBtnMobile.current.style.pointerEvents = 'all'

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
      newPostBtnMobile.current.style.opacity = '1'
      newPostBtnMobile.current.style.pointerEvents = 'all'
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
         return <><h4><i class="fa-solid fa-plus"></i></h4></>
      }

      // let splicedTopic = userSearched.split("Feed")
      return  <><h4><i class="fa-solid fa-plus"></i></h4> </>
   }


   return (
      <>

      {/* NAVBAR */}
      <Navbar {...navbarProps} appearEffect={appearEffect}/>
      <SideNavBar {...sidebarProps} ref={sidebarRefs}/>

      {/* MAIN CONTENT */}

         <main>
            <span ref={darkBG} id="darkBG"></span>
            <section id="content">

               {/* New post button for desktop with a message with it */}
               <span id="newPostBtn" ref={newPostBtn} onClick={()=> appearEffect()}>Express yourself.</span>
               <div id="newPost">

                  {/* New Post button for mobile will always show a plus */}
                  <span id="newPostBtnMobile" ref={newPostBtnMobile} onClick={()=> appearEffect()}><h4><i class="fa-solid fa-plus"></i></h4></span>

                  {/* Floating prompt for creating a new post */}
                  <form enctype="multipart/form-data" ref={createPostElement} id="createPostElement" >
                     <h2 id="createNewPostHeader">What's on your mind? <span onClick={()=> dissappearEffect()}><i className="fa-solid fa-x"></i></span></h2>
                     <div id="formSubject">
                        <input maxLength={40} required placeholder="What's it about?" onsubmit="return false" ref={subjectPostElement}></input><br />
                     </div>
                     <div id="formBody">
                        <input required placeholder='Tell us more..' onsubmit="return false" ref={bodyPostElement}type="text"></input>
                     </div>
                     <div id="selectCommunity">
                        <h2>Community:</h2>
                        <form>
                           <select>
                              <option onClick={()=> postToCommunity('Home')}>Home</option>
                              {userData.map((community, index) => {
                                 return (
                                    <>
                                       <option value={community} onClick={()=> postToCommunity(community)}>{community}</option>
                                    </>
                                 )
                              })}
                           </select>
                        </form>
                     </div>
                     {/* <div id="upload">
                        <label>Upload a picture</label><br />
                        <input accept="image/*" ref={imageRef} type="file" />
                     </div> */}
                     <h4 id="feedbackMessage" ref={errorMessageElement}>{errorMessage}</h4>
                     <button  type='button' onClick={()=> createNewPost()}>Post</button>
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