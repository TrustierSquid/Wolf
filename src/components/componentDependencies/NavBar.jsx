import { forwardRef, useRef, useState, useEffect } from "react"
import logo from '/src/assets/wolfLogo.png'


export default function Navbar() {

   const [followerCount, setFollowerCount] = useState([])
   const [followingCount, setFollowingCount] = useState([])

   // and checking user action based off of username
   const [username, setUsername] = useState(null)

   // the an array of the topics that the user selected
   const [userData, setUserData] = useState([])



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


   const [isNavOpen, setIsNavOpen] = useState(true)
   const navDropdown = useRef(null)
   const navDropdownElement = navDropdown.current

   // Mobile Nav button that appears at a certain breakpoint
   const mobileNavBtn = useRef(null)

   // Dropdown functionality
   // helper function to check to see if any element was clicked that was not the nav button
   const navHelper = (element)=> {
      setIsNavOpen(prevState => !prevState)

      if (isNavOpen) {
         navDropdownElement.style.transform = 'translateY(10px)'
         navDropdownElement.style.pointerEvents = 'all'
         navDropdownElement.style.opacity = '1'
      } else {
         navDropdownElement.style.transform = 'translateY(0px)'
         navDropdownElement.style.opacity = '0'
         navDropdownElement.style.pointerEvents = 'none'
      }

   }

   function logOut(){
      window.location.href = '/'
   }

   return(
      <>
         <nav id="nav">
            <div id="logoContainer">
               <img id="logo" src={logo} alt="" />
               <h1>WOLF</h1>
            </div>
            <div id="profileContainer" onClick={(element)=> navHelper(element)} >
               <h1 id="dropdownBtn"><i className="fa-solid fa-user-large"></i></h1>
            </div>
            <button ref={mobileNavBtn} id="mobileNavBtn"><i className="fa-solid fa-bars"></i></button>
         </nav>

         <section id="navDropdown" ref={navDropdown}>
            {/* view profile button */}
            <div className="navDropdownItemProfile">
               <span><h1><i className="fa-solid fa-user-large"></i></h1></span>
               <div>
                  <h4>See Profile</h4>
                  <h3 id="navUsername">{username}</h3>
               </div>
            </div>



            <div className="navDropdownItem">

            </div>

            <div className="navDropdownItem">

            </div>

            <div className="navDropdownItem" onClick={()=> logOut()}>
               <i className="fa-solid fa-right-from-bracket"></i> Log out
            </div>
         </section>

      </>
   )
}
