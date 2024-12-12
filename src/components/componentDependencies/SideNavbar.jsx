import { forwardRef, useEffect, useRef, useState} from "react"

const SideNavBar = forwardRef(({
   // loggedIn topics
   followers,
   followings,
   UID,
   profileImage
}, props, ref) => {
   const {sideNav} = ref || {}

   const [allCommunities, setAllCommunities] = useState(null)

   async function getCommunityInformation() {
      let response = await fetch('/community/retrieveCommunityInformation', {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
          },
      })

      let data = await response.json()
      setAllCommunities(data)
      // console.log(data)
   }

   const [loggedInUID, setLoggedInUID] = useState(null)
   const [userTopicArray, setUserTopicArray] = useState(null)
   const [followerCount, setFollowerCount] = useState(null)
   const [followingCount, setFollowingCount] = useState(null)
   const [username, setUsername] = useState(null)
   const [profilePicture, setProfilePicture] = useState(null)


   async function getUserData() {
     const response = await fetch(`/users/homeFeed`, {
       method: "GET",
       credentials: "include",
       headers: {
         "Content-Type": "application/json",
       },
     });

     if (!response.ok) {
       console.log("Couldn't get user data");
       throw new Error(`HTTP error! status: ${response.status}`);
     }

     const homeData = await response.json();
     // setting the user info needed as glob vars
     setLoggedInUID(homeData.UID);
     setUserTopicArray(homeData.topicArr)

     // the current user logged in
     setUsername(homeData.userName)

     //  the current users following count
     setFollowingCount(homeData.followingCount.length)

     // the current users follower count
     setFollowerCount(homeData.followerCount.length)

     setProfilePicture(homeData.profilePic)
   }

   useEffect(()=> {
      getCommunityInformation()
      getUserData()
   }, [])


   // Goes to the feed determined in the query string
   function navigateToFeed(topic){
      window.location.href = `/home?topicFeed=${topic + 'Feed'}`
   }

   // if there is no query string when navigating feeds, then it will default to home
   function navigateToHome(){
      window.location.href = `/home`
   }

   function navigateToTopicSelection(){
      window.location.href = `/topics`
   }


   function navigateToFollowingPage(){
      window.location.href = `/followerPage?following=${UID}`
   }

   function navigateToFollowersPage() {
      window.location.href = `/followerPage?followers=${UID}`
   }




   return (
      <>
         <nav className="sideNav" ref={sideNav}>
            <section id="subTitle">
               <h3 id="sidebarUsername">
                  <div id="nameAndInfo">
                  <img id="sideBarProfileImage" src={profileImage ? profileImage : 'src/assets/defaultUser.jpg'} alt="" />
                     <h3>{username}</h3>
                  </div>
               </h3>
            </section>
            <br />
            <section className="topicSelectionElement">
               <button onClick={()=> window.location.href = '/home'}><i class="fa-solid fa-house"></i> Home</button>
               <button onClick={()=> window.location.href = `/profile?user=${loggedInUID}`}><i class="fa-solid fa-user"></i>Profile</button>
               <button onClick={()=> window.location.href = '/communities'}><i className="fa-solid fa-border-all"></i> My Dens </button>
               <button onClick={()=> window.location.href = '/topics'}><i className="fa-solid fa-plus"></i> Join a Wolf's Den</button>
               <button onClick={()=> window.location.href = '/'}><i className="fa-solid fa-right-from-bracket"></i>Logout</button>
               <p style={{color: 'grey'}}>Recently Joined Dens</p>
               {
                  allCommunities ? (
                     allCommunities?.filter(community => Object.values(community.members).some(member => member.member === username)).slice(0, 3).length > 0 ? (
                        allCommunities?.filter(community => Object.values(community.members).some(member => member.member === username)).slice(0, 3).map((community) => {
                           return (
                              <>
                                 <button className="recentlyJoinedDens" onClick={()=> window.location.href = `/home?topicFeed=${community.name + 'Feed'}`}><img src={community.image ? community.image : 'src/assets/wolfLogo.png'} alt="" />{community.name}</button>
                              </>
                           )
                        })
                     ) : (
                        <div className="noPostsMessage">
                           <h3>No dens</h3>
                        </div>
                     )
                  ) : (
                     <div className="noPostsMessage">
                        <div className=" loader "></div>
                     </div>
                  )

               }

            </section>


         </nav>
      </>
   )
})


export default SideNavBar