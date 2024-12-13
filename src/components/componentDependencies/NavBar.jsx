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
  const [notificationList, setNotificationList] = useState(null)
  const notificationMenuRef = useRef(null)

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
      // setting the user info needed as glob vars

      setLoggedInUID(homeData.UID);
      setUsername(homeData.userName);
      setUserTopicList(homeData.topicArr || [])
      setLoggedInProfilePic(homeData.profilePic)
      setNotificationList(homeData.notificationList)

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

  const currentDate = new Date();

  // Configuration for posts's creation data
  function showPostDate(postCreationDate) {
    // Get the difference in milliseconds
    const startDate = new Date(postCreationDate);
    const timeDifference = currentDate - startDate;

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


  const [allCommunities, setAllCommunities] = useState(null)
  const [allClear, setAllClear] = useState('')

   async function getCommunityInformation() {
      let response = await fetch('/community/retrieveCommunityInformation', {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
          },
      })

      let data = await response.json()

      setAllCommunities(data)
   }

  async function clearNotifications() {
    let response = await fetch(`/clearNotifications/${username}`, {
      method: 'PUT'
    })
    let data = await response.json()

    setNotificationList(!notificationList)
    setAllClear("Cleared!")

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

  function openNotifications(action) {
    if (action === 'open') {
      notificationMenuRef.current.style.opacity = '1'
       notificationMenuRef.current.style.pointerEvents = 'all'
    }
    if (action === 'close') {
      notificationMenuRef.current.style.opacity = '0'; notificationMenuRef.current.style.pointerEvents = 'none'
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


  useEffect(()=> {
    getCommunityInformation()
  }, [])

  return (
    <>
      <nav id="nav">
        {/* For Desktop */}
        <div id="logoContainer">
          <div id="titleAndLogo">
            <img id="logo" src={logo} alt="" onClick={()=> window.location.href = '/home'}/>
            <h1>WOLF</h1>
          </div>
          {/* Button becomes disabled after visting any other page that isnt of the home sub domain */}
          {window.location.pathname === '/home' ? (
              <>
                <button onClick={()=> props.appearEffect()}><i className="fa-solid fa-plus"></i> <i class="fa-solid fa-comment"></i></button>
                <button id="notificationBtn" onClick={()=> openNotifications('open')}><i className="fa-solid fa-bell"></i></button>
                <span>
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
                  </span>
              </>
            ) : (
              <>
                <button id="notificationBtn" onClick={()=> openNotifications('open')}><i className="fa-solid fa-bell"></i></button>
                <button style={{display: 'none'}}></button>
              </>
            )}
          {/* Was trying to conditional render this button based on the subdirectory they user is visiting. */}
        </div>

        <div id="profileContainer">
          {/* In place for a profile picture */}
          <img id='dropdownBtn' onClick={()=> navigateProfile()} src={loggedInProfilePic ? loggedInProfilePic : 'src/assets/defaultUser.jpg'} alt="" />
        </div>


        <span id="notificationDropdown" ref={notificationMenuRef}>
          <div id="clearNotifications">
            <h3>Notifications </h3>
            <button onClick={()=> openNotifications('close')}><i class="fa-solid fa-x"></i></button>
          </div>
          {/* <button id="clearBtn" onClick={()=> clearNotifications()}>Clear Notifications</button> */}
            {
              (notificationList) ? (

                notificationList?.length > 0 ? (
                  notificationList?.map((notification) => {
                    return (
                      <>
                        <li className="notification">
                          <img src={notification.initiatorProfilePic ? notification.initiatorProfilePic : 'src/assets/defaultUser.jpg'} alt="" />{notification.title}
                          <p>{showPostDate(notification.date)}</p>
                        </li>
                      </>
                    )
                  })

                ) : (
                  <div className="noPostsMessage">
                    <h3>No Notifications</h3>
                  </div>
                )

              ) : (
                <div className="noPostsMessage">
                  <div className=" loader "></div>
                </div>
              )

            }
        </span>

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
        <h4 className="mobileNavMainBtns" onClick={()=> navigateBackToHome()}><i className="fa-solid fa-house"></i>Home</h4>
        <h4 className="mobileNavMainBtns" onClick={()=> navigateBackToHome()}><i className="fa-solid fa-user"></i>Profile</h4>
        <h4 className="mobileNavMainBtns" onClick={()=> navigateToTopics()}> <i class="fa-solid fa-user-plus"></i>Join a Den </h4>
        <h4 className="mobileNavMainBtns" onClick={()=> window.location.href = '/communities'} > <i className="fa-solid fa-users"></i>My Dens </h4>
        <h4 className="mobileNavMainBtns" onClick={()=> navigateLogOut()}><i className="fa-solid fa-right-from-bracket"></i>Log Out </h4>
        {/* Displays the communities that the user has joined */}
        <h3 id="recentlyJoinedDenMobileTitle">Recently Joined Dens</h3>
        <div id="mobileRecentCommunities">
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
        </div>
      </section>


    </>
  );
}
