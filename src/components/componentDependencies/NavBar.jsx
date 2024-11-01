import { forwardRef, useRef, useState, useEffect } from "react";
import logo from "/src/assets/wolfLogo.png";

export default function Navbar(props) {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const whatCommunity = urlParams.get("topicFeed");


  const [loggedInUID, setLoggedInUID] = useState(null);
  const [username, setUsername] = useState(null);
  const [userTopicList, setUserTopicList] = useState([])


  const [isNavOpen, setIsNavOpen] = useState(true);
  const navDropdown = useRef(null);
  const navDropdownElement = navDropdown.current;


  // Mobile Nav button that appears at a certain breakpoint
  const mobileNavBtn = useRef(null);

  const mobileNavMenu = useRef(null)
  const [isMobileNavMenuOpen, setIsMobileNavMenuOpen] = useState(true)
  const [loggedInProfilePic, setLoggedInProfilePic] = useState(null)

  // GETTING USER INFORMATION AND DISPLYING IT ON THE HOME PAGE SPECIFIC TO THE USER LOGGED IN
  useEffect(() => {
    async function getUserData() {
      const response = await fetch(`/users/homeFeed`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const homeData = await response.json();
      // console.log(homeData.followingCount.length)
      // setting the user info needed as glob vars

      setLoggedInUID(homeData.UID);
      setUsername(homeData.userName);
      setUserTopicList(homeData.topicArr || [])
      setLoggedInProfilePic(homeData.profilePic)

    }


    getUserData();



  }, []);

  function determineUserType(user){
    switch (user) {
      case "Samuel":
        return (
          <>
            <h4 style={{color: '#00b3ff'}}>Developer <i className="fa-solid fa-code"></i></h4>
          </>
        )
      case "DemoUser":
        return (
          <>
            <h4 style={{ color: "#73ff00" }}>Recruiter</h4>
          </>
        )
      default:
        return (
          <>
            <h4 style={{ color: "grey" }}>User</h4>
          </>
        )

    }
  }



  function openMobileNavMenu(navBtn){
    setIsMobileNavMenuOpen(prevState => !prevState)

    if (isMobileNavMenuOpen) {
      mobileNavMenu.current.style.left = '0%'
      mobileNavMenu.current.style.opacity = '1'
      // document.body.style.overflow = 'hidden';
      navBtn.target.style.color = 'red'
      // window.scrollTo(-10, -10);
      mobileNavMenu.current.style.width = '80%'

    } else {
      mobileNavMenu.current.style.left = '-50%'
      mobileNavMenu.current.style.width = '0px'
      document.body.style.overflow = 'auto';
      navBtn.target.style.color = 'white'
      mobileNavMenu.current.style.opacity = '0'
      mobileNavMenu.current.pointerEvents = 'none'

    }
  }

  function navigateLogOut() {
    window.location.href = "/";
  }

  function navigateBackToHome() {
    window.location.href = "/home";
  }

  function navigateProfile() {
    window.location.href = `/profile?user=${loggedInUID}`;
  }

  function navigateToFeed(feed){
    window.location.href = `/home?topicFeed=${feed}`
  }

  function navigateToTopics(){
    window.location.href = `/topics`
  }


  return (
    <>
      <nav id="nav">
        {/* For Desktop */}
        <div id="logoContainer">
          <div id="titleAndLogo">
            <img id="logo" src={logo} alt="" />
            <h1>WOLF</h1>
          </div>
          <button onClick={()=> navigateBackToHome()}><i className="fa-solid fa-house"></i></button>
          {/* Button becomes disabled after visting any other page that isnt of the home sub domain */}
          {window.location.pathname === '/home' ? (
              <>
                <button onClick={()=> props.appearEffect()}><i className="fa-solid fa-square-plus"></i> Post</button>
                <h3>
                  {
                    (whatCommunity === null) ? (
                      <>
                        <h3>Home</h3>
                      </>
                    ) : (
                      <>
                        <h3>{whatCommunity.split('Feed')}</h3>
                      </>
                    )
                  }
                  </h3>
              </>
            ) : (
              <>
                <button style={{display: 'none'}}></button>
              </>
            )}
          {/* Was trying to conditional render this button based on the subdirectory they user is visiting. */}
        </div>

        <div id="profileContainer">
          {/* In place for a profile picture */}

          <img id='dropdownBtn' onClick={()=> navigateProfile()} src={loggedInProfilePic ? loggedInProfilePic : 'src/assets/defaultUser.jpg'} alt="" />
        </div>

        {/* Mobile Navs */}
        <button ref={mobileNavBtn} id="mobileNavBtn" onClick={(self)=> openMobileNavMenu(self)}>
          <i className="fa-solid fa-bars"></i>
        </button>
      </nav>

      <section id="mobileNavMenu" ref={mobileNavMenu} >
        <div className='mobileNavProfileSection' onClick={()=> navigateProfile()}>
          <img src={loggedInProfilePic ? loggedInProfilePic : 'src/assets/defaultUser.jpg'} alt="" />
          <section id="mobileWhoAmI">
            <h5 style={{color: '#ff7b00'}}>VIEW PROFILE</h5>
            <h2>{username}</h2>
            <h3>{determineUserType(username)}</h3>
          </section>
        </div>

        {/* <hr /> */}
        <h4 className="mobileNavMainBtns" onClick={()=> navigateLogOut()}>Log Out <i className="fa-solid fa-right-from-bracket"></i></h4>
        <h4 className="mobileNavMainBtns" onClick={()=> navigateBackToHome()}>Home Feed <i className="fa-solid fa-house"></i></h4>
        <h4 className="mobileNavMainBtns" onClick={()=> navigateToTopics()}>Join a Topic <i class="fa-solid fa-user-plus"></i></h4>
        <h4 className="mobileNavMainBtns" onClick={()=> window.location.href = '/communities'} >My Communities <i className="fa-solid fa-users"></i></h4>
        {/* Displays the communities that the user has joined */}
        {/* {userTopicList?.length > 0 ? (
          userTopicList.map((topic, key)=> {
            return (
              <>
                <h4 className="mobileNavTopicBtns"
                 key={key}
                 onClick={()=> navigateToFeed(topic + 'Feed')}
                 >  {topic} Feed <i className="fa-solid fa-arrow-right"></i></h4>
              </>
            )
          })
        ) : (
          <div className="noTopicsMessage">
            <h3>No Topics Available</h3>
            <p>Start joining topics to see them here.</p>
          </div>
        )} */}
      </section>


    </>
  );
}
