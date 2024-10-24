import { forwardRef, useRef, useState, useEffect} from "react"
import { useLocation } from "react-router-dom"
import Navbar from "../componentDependencies/NavBar"
import SideNavBar from "../componentDependencies/SideNavbar"

export default function Profile(props){
   const [followerCount, setFollowerCount] = useState([])
   const [followingCount, setFollowingCount] = useState([])

   // and checking user action based off of username
   const [username, setUsername] = useState(null)

   // the an array of the topics that the user selected
   const [userData, setUserData] = useState([])



   // Data for the user logged in
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

   const [profilePostData, setProfilePostData] = useState([])
   const [userProfileData, setUserProfileData] = useState([])

   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString)
   const userSearched = urlParams.get('user')

   const [dynamicUsername, setDynamicUsername] = useState(null)
   const [dynamicFollowingArr, setDynamicFollowingArr] = useState(null)
   const [dynamicFollowerArr, setDynamicFollowerArr] = useState(null)
   const [dynamicUID, setDynamicUID] = useState(null)
   const [dynamicBio, setDynamicBio] = useState(null)


   /*
      Gets User information based on what user is selected from the query string
      On the main feed page, the user can be selected by post click or seeing them in the
      members moodle for a particular community
    */
   async function getUserProfilePosts(feedView = 'mainFeed') {
      try {
         const response = await fetch(`/profileData?user=${userSearched}&feed=${feedView}`, {
            method: "GET",
            headers: {
               'Content-Type': 'application/json'
            },
         })

         // Sending back post data for the searched user
         const postData = await response.json()
         console.log(postData)
         setProfilePostData(postData.profilePostData.reverse() || [])
         // sending back the userdata for the searched user

         // The userData that gets returned based on the UID
         setUserProfileData(postData.userData || [])

         setDynamicFollowerArr(postData.userData.followers)
         setDynamicFollowingArr(postData.userData.following)

         // The username that the UID has in store
         setDynamicUsername(postData.userData.user)
         setDynamicUID(postData.userData.UID)
         setDynamicBio(postData.userData.userBio)


      } catch {
         throw new Error("Couldnt fetch for profile data")
      }

   }

   useEffect(()=> {
      if (!userSearched) return
      getUserProfilePosts()
   }, [userSearched])


   const followBtnRef = useRef(null)

// queryStringUser is the user looked up via query string
// and comparing it to the uuid of the logged in user







   const [displayFollowing, setDisplayFollowing] = useState(false)

   const displayFollow = (bool)=> {
      setDisplayFollowing(bool)
   }


   function checkUserType(){
      switch (dynamicUsername) {
         // For developers
         case 'Samuel':
            return (
               <>
                  <div id="iconAndUsername">
                     {/* <i className="fa-solid fa-user"></i> */}
                     <div>
                        <h3>{dynamicUsername}</h3>
                        <h5 className="profileUserTypeHeader"
                        style={{color: "#00b3ff"}}>
                           Developer <i className="fa-solid fa-code"></i></h5>
                     </div>

                     <div id="followTracking">
                        <section>
                           <h3>{dynamicFollowerArr?.length}</h3>
                           <p>Followers</p>
                        </section>
                        <section>
                           <h3>{dynamicFollowingArr?.length}</h3>
                           <p>Following</p>
                        </section>
                     </div>

                  </div>

               </>
            )
            // for recruiters
         case 'DemoUser':
            return (
               <>
                  <div id="iconAndUsername">
                     <i className="fa-solid fa-user"></i>
                     <div>
                        <h3>{dynamicUsername}</h3>
                        <h5 className="profileUserTypeHeader" style={{color: "#73ff00"}}>Recruiter <i className="fa-solid fa-clipboard"></i></h5>
                     </div>

                     <div id="followTracking">
                        <section>
                           <h3>{dynamicFollowerArr?.length}</h3>
                           <p>Followers</p>
                        </section>
                        <section>
                           <h3>{dynamicFollowingArr?.length}</h3>
                           <p>Following</p>
                        </section>
                     </div>
                  </div>
               </>
            )
         // For regular users
         default:
            return (
               <>
                  <div id="iconAndUsername">
                     <div>
                        <h3>{dynamicUsername}</h3>
                        <h5 className="profileUserTypeHeader"
                        style={{color: "darkgrey"}}>User</h5>
                     </div>

                     <div id="followTracking">
                        <section>
                           <h3>{dynamicFollowerArr?.length}</h3>
                           <p>Followers</p>
                        </section>
                        <section>
                           <h3>{dynamicFollowingArr?.length}</h3>
                           <p>Following</p>
                        </section>
                     </div>

                  </div>

               </>
            )

      }
   }


   // poster is used to find the corresponding profile for the poster
  async function navigateToProfile(user) {
      const response = await fetch(`/profileData/getID?poster=${user}`, {
      method: "GET",
      headers: {
         'Content-Type': 'application/json'
      }
      })

      const data = await response.json()

      // The data returns the fetched user uid
      window.location.href = `/profile?user=${data.userUID}`;

   }

   const currentDate = new Date();

  // Configuration for posts's creation data
  function showPostDate(postCreationDate) {
    // Get the difference in milliseconds
    const startDate = new Date(postCreationDate);
    const timeDifference = currentDate - startDate;
    // console.log(postCreationDate)

    // Covert the difference from milliseconds to day and hours
    const millisecondsInOneDay = 24 * 60 * 60 * 1000;
    const millisecondsInOneHour = 60 * 60 * 1000;
    const millisecondsInOneMinute = 60 * 1000;

    // Calculate days and hours
    const daysPassed = Math.floor(timeDifference / millisecondsInOneDay);
    const hoursPassed = Math.floor(
      (timeDifference % millisecondsInOneDay) / millisecondsInOneHour
    );
    const minutesPassed = Math.floor(
      (timeDifference % millisecondsInOneHour) / millisecondsInOneMinute
    );

    // Calculate months using the date object
    const monthsPassed =
    currentDate.getMonth() -
    startDate.getMonth() +
    12 * (currentDate.getFullYear() - startDate.getFullYear());




    // Display time passed
    if (monthsPassed >= 1) {
      return <h4 className="postData">{`${monthsPassed}Mth ago`}</h4>;
    }


    if (daysPassed >= 1) {
      return <h4 className="postData">{`${daysPassed}d ago`}</h4>;
    }

    if (hoursPassed > 0) {
      return <h4 className="postData">{`${hoursPassed}hr ago`}</h4>;
    }

    if (minutesPassed > 0) {
      return <h4 className="postData">{`${minutesPassed}m ago`}</h4>;
    }

    return <h4 className="postData">Just now</h4>;


  }

  /*
   queryStringUser === props.loggedInUID

   this is what determines wether or not the visited profile is the profile that belongs to the logged in user

   */

   const bioElementDisplay = useRef()
   const bioElementEnter = useRef()
   const bioEnter = useRef()
   const updateBioBtn = useRef()
   const changeBioBtn = useRef()



   //  Styling helper function to change the appearance
   const switchToEnter = ()=> {
      // Styling changes
      bioElementDisplay.current.style.display = 'none'
      bioElementEnter.current.style.display = 'block'
      bioElementEnter.current.value = dynamicBio
      changeBioBtn.current.style.display = 'none'
      updateBioBtn.current.style.display = 'block'

   }


  async function addProfileBio(){
   // Value of the profile bio
   let bioDisplay = bioElementDisplay.current.value


   // Server calls
   let response = await fetch(`/updateBio/${dynamicUID}`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({newBio: bioEnter.current.value})
   })

   if(!response.ok) {
      throw new Error("Could not change bio");
   }

   // Styling changes
   changeBioBtn.current.style.display = 'block'
   updateBioBtn.current.style.display = 'none'
   bioElementDisplay.current.style.display = 'block'
   bioElementEnter.current.style.display = 'none'

   // Updating the values in the user data
   getUserProfilePosts()

  }

  /*
     * hashed querystring that contains the username that the backend will search for
     * once found, it will display the respective profile page
     * If the queryString matches the loggedIn UID it will know that it is looking
     at the logged in users own page. Therefore, no followbtn will be rendered
  */

   const followBtn = useRef()
   const unfollowBtn = useRef()
   const [isFollowing, setIsFollowing] = useState(false)

   // Checks to see if the loggedInUser is already following the target user
   function checkFollowing(){
      if (userProfileData?.followers?.includes(username)) {
         followBtn.current.style.display = 'none'
         unfollowBtn.current.style.display = 'block'
      }
   }

   async function followSystem() {


      let response = await fetch('/addFollowingUser', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({followee: userSearched, loggedInUser: props.loggedInUID})
      })

      // updating the profile data
      getUserProfilePosts()

      followBtn.current.style.display = 'block'
      unfollowBtn.current.style.display = 'none'

   }

   checkFollowing()

   const sidebarProps = {
      username: username,
      followings: followingCount,
      followers: followerCount,
   }



   return (
      <>
         <Navbar />
         <div id="contentContainer">
            <SideNavBar {...sidebarProps}/>
            <main id="mainProfile">
               {/* <h2 className="profHeaders">Profile Overview</h2> */}
               <div className="profileAnalytics">
                  {/* Checks for the type of user is being displayed */}
                  {checkUserType()}

                  <section id="followBtnPair">

                     {
                        // checking to see if the user is on the same profile as the loggedIn user
                        (userSearched === props.loggedInUID) ? (
                           <>
                              <span></span>
                           </>
                        ) : (
                           <>
                              <button id="followBtn" ref={followBtn} onClick={()=> followSystem()}>Follow </button>
                              {/*Initialy disabled*/} <button id="unfollowBtn" ref={unfollowBtn} onClick={()=> followSystem()}>UnFollow</button>
                           </>
                        )
                     }

                  </section>

                  <div id="bioPair">
                     <div id="bioTitle">
                        <h3>Bio</h3>
                        {/* Bio edit shows up for the user logged in and not on other profile */}
                        {
                           (userSearched === props.loggedInUID) ? (
                              <>
                                 <i className="fa-solid fa-pencil" onClick={()=> switchToEnter()} ref={changeBioBtn}></i>
                              </>
                           ) : (
                              <>
                                 <span></span>
                              </>
                           )
                        }
                        <button id="updateBioBtn" ref={updateBioBtn} onClick={()=> addProfileBio()}>Update Bio</button>
                     </div>
                     <br />

                     {/* This is the version on the bio is for when the user enters a new or edited bio */}
                     <span id="userEnterBio" ref={bioElementEnter}>
                        <textarea ref={bioEnter} maxLength={300} placeholder={dynamicBio}>{dynamicBio}</textarea>
                     </span>

                     {/* This is the version on the bio is is strictly for display  */}
                     <span id="profileBio" ref={bioElementDisplay}>
                        {dynamicBio}
                     </span>

                  </div>


               </div>

               <div className="totalPosts">
                  <section className="profHeaders">
                     <h2>{dynamicUsername}'s Posts </h2>
                     <form>
                        <h3>Community Feed:</h3>
                        {/* The dropdown selection menu that displays topics that the user is currently apart of  */}
                        {userProfileData?.topics?.length > 0 && (
                           <select className="topicDisplaySelection">
                              <option onClick={()=> getUserProfilePosts("mainFeed")}>Home Feed</option>

                              {userProfileData.topics.map((topic, index) => (
                                 <option key={index} onClick={()=> getUserProfilePosts(topic + "Feed")}>{topic} Feed</option>
                              ))}

                           </select>
                        )}

                     </form>
                  </section>
                  {/* CONDITIONAL RENDERING */}
                  {/* Showing profile post data for each post the current user has made on the corresponding community feed */}
                  {profilePostData?.length > 0 ? (
                     profilePostData.map((post, index)=> {
                        return (
                           <>
                              <article key={index} className="existingPost">
                                 <div className="existingPostTitle">
                                    {dynamicUsername}
                                    {/* If the profile post user is the developer or anyone else then display accordingly */}
                                    {
                                       (dynamicUsername === 'Samuel') ? (
                                          <>
                                             <span className="developerStatus">Developer</span>
                                          </>
                                       ) : (
                                          <>
                                             <span className='userStatus'>User</span>
                                          </>
                                       )
                                    }
                                    <p style={{color: 'grey'}}>{showPostDate(post.postCreationDate)}</p>
                                 </div>
                                 <h2 className="profilePostSubject">
                                    <span>

                                       {" " + post.subject}

                                    </span>
                                 </h2>
                                 <p className="profilePostBody">{post.body}</p>
                                 <div className="profilePostAnalytics">
                                    <h5><i style={{color: "grey"}} className="fa-solid fa-heart"></i> {post.likes.length}</h5>
                                    <h5 style={{color: "grey"}}><i style={{color: "grey"}} className="fa-solid fa-comments"></i> {post.comments.length}</h5>
                                 </div>

                              </article>
                           </>
                        )
                     })
                  ) : (
                     // if there is no posts made by the user in question in that specific comminui
                     <div className="noPostsMessage">
                        <h3>{dynamicUsername} hasn't posted anything here yet!</h3>
                        <p>Get them to share something! 😃</p>
                     </div>
                  )}
               </div>






            </main>
         </div>
      </>
   )
}