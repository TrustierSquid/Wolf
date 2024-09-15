import { forwardRef, useRef, useState, useEffect } from "react";
import logo from "/src/assets/wolfLogo.png";

export default function Navbar() {
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

  const navHelper = (element) => {

    setIsNavOpen((prevState) => !prevState);

    if (isNavOpen) {
      navDropdownElement.style.transform = "translateY(10px)";
      navDropdownElement.style.pointerEvents = "all";
      navDropdownElement.style.opacity = "1";
    } else {
      navDropdownElement.style.transform = "translateY(0px)";
      navDropdownElement.style.opacity = "0";
      navDropdownElement.style.pointerEvents = "none";
    }
  };

  function openMobileNavMenu(navBtn){
    setIsMobileNavMenuOpen(prevState => !prevState)

    if (isMobileNavMenuOpen) {
      mobileNavMenu.current.style.left = '0%'
      mobileNavMenu.current.style.opacity = '1'
      // document.body.style.overflow = 'hidden';
      navBtn.target.style.color = 'red'
      window.scrollTo(-10, -10);

    } else {
      mobileNavMenu.current.style.left = '-50%'
      document.body.style.overflow = 'auto';
      navBtn.target.style.color = 'white'
      mobileNavMenu.current.style.opacity = '0'

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
        <div id="logoContainer" onClick={() => navigateBackToHome()}>
          <img id="logo" src={logo} alt="" />
          <h1>WOLF</h1>
        </div>
        <div id="profileContainer" onClick={(element) => navHelper(element)}>
          <h1 id="dropdownBtn">
            {username} <i className="fa-solid fa-fire"></i>
          </h1>
        </div>

        {/* Mobile Navs */}
        <button ref={mobileNavBtn} id="mobileNavBtn" onClick={(self)=> openMobileNavMenu(self)}>
          <i className="fa-solid fa-bars"></i>
        </button>
      </nav>

      <section id="mobileNavMenu" ref={mobileNavMenu} >
        <div className='mobileNavProfileSection' onClick={()=> navigateProfile()}>
          <h5 className="subTitle">View Profile</h5>
          <h2>{username}</h2>
          <h3>{determineUserType(username)}</h3>
        </div>

        {/* <hr /> */}
        <h4 className="mobileNavMainBtns" onClick={()=> navigateBackToHome()}>Home Feed</h4>
        <h4 className="mobileNavMainBtns" onClick={()=> navigateToTopics()}>Join a Topic</h4>
        <h4 className="subTitle">JOINED TOPICS</h4>
        {userTopicList.map((topic, key)=> {
          return (
            <>
              <h4 className="mobileNavTopicBtns"
               key={key}
               onClick={()=> navigateToFeed(topic + 'Feed')}
               >{topic}</h4>
            </>
          )
        })}
      </section>

      <section id="navDropdown" ref={navDropdown}>
        {/* view profile button */}
        <div
          className="navDropdownItemProfile"
          onClick={() => navigateProfile()}
        >
          <span>
            <h1>
              <i className="fa-solid fa-user-large"></i>
            </h1>
          </span>
          <div>
            <h4>See Profile</h4>
            <h3 id="navUsername">{username}</h3>
          </div>
        </div>

        <div className="navDropdownItem"></div>

        <div className="navDropdownItem"></div>

        <div className="navDropdownItem" onClick={() => navigateLogOut()}>
          <i className="fa-solid fa-right-from-bracket"></i> Log out
        </div>
      </section>
    </>
  );
}
