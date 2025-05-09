import { forwardRef, useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../componentDependencies/NavBar";
import SideNavBar from "../componentDependencies/SideNavbar";
import defaultProfilePic from '/src/assets/defaultUser.png';
import CommentMoodle from "../moodleComponents/CommentMoodle";
import ShowLikes from "../moodleComponents/ShowLikes";

export default function Profile(props) {
  // Strictly holds the quick access information of the logged in user
  const [loggedInUserBaseInformation, setLoggedInUserBaseInformation] = useState([])

  // This useState tracks the feed that the profile page will show
  const [trackedFeed, setTrackedFeed] = useState(null)


  // Query string tracking
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userSearched = urlParams.get("user");

  // Data for the user logged in
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
        console.log("Couldn't get user data");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Its workig')

      const homeData = await response.json();
      // setting the user info needed as one useState
      setLoggedInUserBaseInformation(homeData)

    }

    getUserData();
  }, []);


  // Getting the post data from the user
  const [profilePostData, setProfilePostData] = useState(null);
  const [userProfileData, setUserProfileData] = useState([]);

  

  /*
      Gets User information based on what user is selected from the query string
      On the main feed page, the user can be selected by clicking on a post or seeing them in the
      members moodle for a particular community
    */
  async function getUserProfilePosts(feedView = "mainFeed" /* Default is mainFeed */) {
    try {
      const response = await fetch(
        // API args: user UID and  what community feed
        `/profileData?user=${userSearched}&feed=${feedView}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Sending back post data for the searched user
      const postData = await response.json();
      // Sends back all of the post information for a particular feed
      setProfilePostData(postData.profilePostData.reverse() || []);

      // The userData that gets returned based on the UID
      // all based on whos profile the user is looking at
      setUserProfileData(postData.userData || []);

      setTrackedFeed(feedView)
    } catch {
      throw new Error("Couldnt fetch for profile data");
    }
  }

  // Getting all communities and their information
  async function getCommunities() {
    let response = await fetch("/community/retrieveCommunityInformation", {
      method: "POST",
    });

    let data = await response.json();
    setCommunities(data);
  }

  useEffect(() => {
    if (!userSearched) return;
    getUserProfilePosts();
    getCommunities();
  }, [userSearched]);


  // queryStringUser is the user looked up via query string
  // and comparing it to the uuid of the logged in user

  const [communities, setCommunities] = useState(null);


  // Current day to determine how much time has passed since the user made a post
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

  /*
   queryStringUser === props.loggedInUID

   this is what determines wether or not the visited profile is the profile that belongs to the logged in user

   */

  // The display for the profile bio
  const bioElementDisplay = useRef();

  // The textarea for entering a new bio
  const bioElementEnter = useRef();

  const bioEnter = useRef();
  const updateBioBtn = useRef();
  const changeBioBtn = useRef();

  //  Styling helper function to change the appearance to enter in profile bio
  const switchToEnter = () => {
    // Styling changes
    bioElementDisplay.current.style.display = "none";
    bioElementEnter.current.style.display = "block";
    bioElementEnter.current.value = userProfileData.userBio;
    changeBioBtn.current.style.display = "none";
    updateBioBtn.current.style.display = "block";
  };

  async function addProfileBio() {
    // Value of the profile bio
    // let bioDisplay = bioElementDisplay.current.value

    if (bioEnter.current.value === "") {
      bioElementDisplay.current.value = userProfileData.userBio;
      return;
    }

    // Sending new bio to the server 
    let response = await fetch(`/updateBio/${userProfileData.UID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newBio: bioEnter.current.value }),
    });

    if (!response.ok) {
      throw new Error("Could not change bio");
    }

    // Styling changes for the bio section 
    changeBioBtn.current.style.display = "block";
    updateBioBtn.current.style.display = "none";
    bioElementDisplay.current.style.display = "block";
    bioElementEnter.current.style.display = "none";

    // Updating the values in the user data
    getUserProfilePosts();
  }

  /*
     * hashed querystring that contains the username that the backend will search for
     * once found, it will display the respective profile page
     * If the queryString matches the loggedIn UID it will know that it is looking
     at the logged in users own page. Therefore, no followbtn will be rendered
  */

  const followBtn = useRef();
  const unfollowBtn = useRef();

  // Checks to see if the loggedInUser is already following the target user 
  function checkFollowing() {
    if (userProfileData?.followers?.includes(loggedInUserBaseInformation.userName)) {
      followBtn.current.style.display = "none";
      unfollowBtn.current.style.display = "block";
    }
  }

  // user following system
  async function followSystem() {
    let response = await fetch("/addFollowingUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followee: userSearched,
        // loggedInUser: props.loggedInUID,
        loggedInUser: loggedInUserBaseInformation.UID,
      }),
    });

    // updating the profile data
    getUserProfilePosts();

    followBtn.current.style.display = "block";
    unfollowBtn.current.style.display = "none";
  }

  checkFollowing();

  



  const moodleContainerRef = useRef();
  const overlay = useRef();
  const feedback = useRef();

  // Sidebar props for scaling. In case theres a feature that exclusively needs to be added on sidebar profile component
  const sidebarProps = {
    username: loggedInUserBaseInformation.userName,
    followings: loggedInUserBaseInformation.followingCount,
    followers: loggedInUserBaseInformation.followerCount,
    UID: loggedInUserBaseInformation.UID,
    profileImage: loggedInUserBaseInformation.profilePic,
  };

  // Navigating to following page based on loggedInUser UID
  function navigateToFollowingPage(UID) {
    window.location.href = `/followerPage?following=${UID}`;
  }

  // Navigating to followers page based on loggedInUser UID
  function navigateToFollowersPage(UID) {
    window.location.href = `/followerPage?followers=${UID}`;
  }

  // Changing profile picture
  const imageRef = useRef();
  const [updateMessage, setUpdateMessage] = useState("");
  
  async function changeProfilePicture() {
    let imageFile = imageRef.current.files[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    let response = await fetch(`/uploadProfilePicture/${loggedInUserBaseInformation.UID}`, {
      method: "POST",
      body: formData,
    });

    window.location.reload();

  }

  // Configuration for posts's time creation data
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
      return <p className="postData">{`• ${monthsPassed}Mth ago`}</p>;
    }

    if (daysPassed >= 1) {
      return <p className="postData">{` • ${daysPassed}d ago`}</p>;
    }

    if (hoursPassed > 0) {
      return <p className="postData">{` • ${hoursPassed}hr ago`}</p>;
    }

    if (minutesPassed > 0) {
      return <p className="postData">{` • ${minutesPassed}m ago`}</p>;
    }

    return <p className="postData"> • Just now</p>;
  }

  // Displaying profile picture, username and follower information
  /* Switch statement contains the layout of what the profile page will look like for the user
    Based on what profile is being viewed. There is a seprate case for developers and another for
    regular users
   */

  const followBtnPair = useRef();

  function showFollowBtns() {
    if (userSearched === props.loggedInUID) {
      return <span></span>;
    } else {
      return (
        <>
          <button id="followBtn" ref={followBtn} onClick={() => followSystem()}>
            Follow{" "}
          </button>
          {/*Initialy disabled*/}{" "}
          <button
            id="unfollowBtn"
            ref={unfollowBtn}
            onClick={() => followSystem()}
          >
            UnFollow
          </button>
        </>
      );
    }
  }

  const likeBtn = useRef([]);

  // Post liking system
  async function addLike(postID, currentPostIndex) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userSearched = urlParams.get("topicFeed");

    // Sound Effects for liking and commenting on posts
    let likeSoundEffect = new Audio('/src/assets/audio/likeSound.mp3')
    likeSoundEffect.volume = 0.4

    likeSoundEffect.play()
    // likeBtn.current[currentPostIndex].style.color = 'red'

    if (!queryString) {
      // If the like is being made on the users home feed
      const response = await fetch(`/addLike?feed=mainFeed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ postID: postID, loggedInUser: loggedInUserBaseInformation.userName }),
      });

      // Check if the like was successfully added (optional)
      if (response.ok) {
       
        // update the post data to reflect that the user has liked or unlikeed the post
        await getUserProfilePosts(trackedFeed)
      } else {
        console.error("error adding like");
      }

    } else {

      // If the like is being made on another users profile page
      const response = await fetch(`/addLike?feed=${trackedFeed}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ postID: postID, loggedInUser: loggedInUserBaseInformation.userName }),
      });

      // Check if the like was successfully added (optional)
      if (response.ok) {

        // update the post data to reflect that the user has liked or unlikeed the post
        await getUserProfilePosts(trackedFeed)
      } else {
        console.error("error adding like");
      }
    }
  }

  // Checks and shows if a user is already liking a post or not
  function checkCurrentlyLiked() {
    profilePostData?.map((post, index) => {
      if (post.likes.some(like => like.dynamicUser === loggedInUserBaseInformation.userName)) {
        likeBtn.current[index].style.color = "red";
      } else {
        likeBtn.current[index].style.color = "white";
      }
      
    })
  }

  // This useEffect checks if the user is already following the target user
  useEffect(() => {
    checkCurrentlyLiked()
  }, [profilePostData, loggedInUserBaseInformation, getUserProfilePosts])
    
    
  // Has only a default for scalibility 
  function checkUserType() {
    switch (userProfileData.user) {
      default:
        return (
          <>
            <div id="iconAndUsername">
              <section id="picContainer">
                <img
                  src={
                    userProfileData.profilePic
                      ? userProfileData.profilePic
                      : defaultProfilePic
                  }
                  alt=""
                  id="profilePicture"
                />
                <div id="whoAmI">
                  <div className="showProfileUsername">
                    {userSearched === loggedInUserBaseInformation.UID ? (
                      <div id="changeOverlay">
                        <p id="changePictureBtn">Change Profile Picture</p>
                        <input
                          ref={imageRef}
                          accept="image/*"
                          type="file"
                          onChange={() => {
                            changeProfilePicture();
                            setUpdateMessage("Profile Picture Changed!");
                          }}
                        />
                      </div>
                    ) : (
                      <span></span>
                    )}
                    <h2>{userProfileData.user}</h2>
                  </div>
                  {/* If the query string UID matches the logged in user, change picture btn will render */}
                  <div id="followTracking">
                    {userSearched === loggedInUserBaseInformation.UID ? (
                      <>
                        <section
                          onClick={() => navigateToFollowersPage(loggedInUserBaseInformation.UID)}
                        >
                          <p><span className="followerStyle">{userProfileData.followers?.length} </span>FOLLOWERS</p>
                        </section>
                        <section
                          onClick={() => navigateToFollowingPage(loggedInUserBaseInformation.UID)}
                        >
                          <p><span className="followingStyle">{userProfileData.following?.length}</span> FOLLOWING</p>
                        </section>
                      </>
                    ) : (
                      <>
                        <section
                          onClick={() => navigateToFollowersPage(userProfileData.UID)}
                        >
                          <p><span className="followerStyle">{userProfileData.followers?.length} </span>FOLLOWERS</p>
                        </section>
                        <section
                          onClick={() => navigateToFollowingPage(userProfileData.UID)}
                        >
                          <p><span className="followingStyle">{userProfileData.following?.length}</span> FOLLOWING</p>
                        </section>
                      </>
                    )}
                  </div>

                  <p id="updateMessage">{updateMessage}</p>
                </div>
              </section>

            </div>
          </>
        );
    }
  }

  

  return (
    <>
      <Navbar />
      <SideNavBar {...sidebarProps} />
      <span ref={overlay} id="overlayProfile" onClick={() => backOut()}></span>
      <div id="contentContainer">
        <main id="mainProfile">
          {/* <h2 className="profHeaders">Profile </h2> */}
          <div className="profileAnalytics">
            {/* Checks for the type of user is being displayed */}
            {/* Displays name and followers */}
            {checkUserType()}

            {/* BIO SYSTEM */}
            <div id="bioPair">
              {/* This is the version on the bio is for when the user enters a new or edited bio */}
              <span id="userEnterBio" ref={bioElementEnter}>
                <textarea
                  ref={bioEnter}
                  maxLength={300}
                  placeholder={userProfileData.userBio}
                >
                  {userProfileData.userBio}
                </textarea>
              </span>

              {/* This is the version on the bio is is strictly for display  */}
              <span id="profileBio" ref={bioElementDisplay}>
                {userProfileData.userBio}
              </span>

              <div id="bioTitle">

                {/* Bio edit shows up for the user logged in and not on other profile */}
                {userSearched === props.loggedInUID ? (
                  <>
                    <button
                      className="changeBioButton"
                      onClick={() => switchToEnter()}
                      ref={changeBioBtn}
                    >Change Bio</button>
                  </>
                ) : (
                  <>
                    <span></span>
                  </>
                )}
                <button
                  id="updateBioBtn"
                  ref={updateBioBtn}
                  onClick={() => addProfileBio()}
                >
                  Update Bio
                </button>
              </div>
            </div>

            {/*  FOLLOW SYSTEM */}
            <section id="followBtnPair" ref={followBtnPair}>
              {showFollowBtns()}
            </section>
          </div>

          

          <div className="totalPosts">
            <section className="profHeaders">
              <h2>Posts </h2>
              <form>
                {/* The dropdown selection menu that displays topics that the user is currently apart of  */}
                <select
                  className="topicDisplaySelection"
                  onChange={(e) => getUserProfilePosts(e.target.value)}
                >
                  <option value="All Posts" onClick={()=> {getUserProfilePosts('All')}}>All Posts</option>
                  <option
                  // Defaults to "mainFeed"
                    onClick={() => {getUserProfilePosts()}}
                    value="mainFeed"
                  >
                    Home Feed
                  </option>
                  {/* Determines what community the logged in user is apart of */}
                  {communities
                    ?.filter((community) =>
                      Object.values(community.members).some(
                        (member) => member.member === loggedInUserBaseInformation.userName
                      )
                    )
                    .map((community) => {
                      return (
                        <>
                          <option
                            value={`${community.name}Feed`}
                            onClick={() =>
                                getUserProfilePosts(community.name + "Feed")
                            }
                          >
                            {community.name} Feed
                          </option>
                        </>
                      );
                    })}
                </select>
              </form>
            </section>
            {/* CONDITIONAL RENDERING */}

            {/* Showing profile post data for each post the current user has made on the corresponding community feed */}
            {profilePostData ? (
              <>
                {profilePostData?.length > 0 ? (
                  profilePostData?.map((post, index) => {
                    return (
                      <>
                        <article
                          key={index}
                          className="existingPost"
                        >
                          <div className="existingPostTitle">
                            <img
                              className="posterProfileImg"
                              src={
                                post.posterProfilePic
                                  ? post.posterProfilePic
                                  : defaultProfilePic
                              }
                              alt=""
                            />
                            <h4>{userProfileData.user} </h4>
                            <p style={{ color: "grey" }}>
                              {showPostDate(post.postCreationDate)}
                            </p>
                          </div>
                          <h2 className="profilePostSubject">
                            <span>{" " + post.subject}</span>
                          </h2>
                          {post.image ? (
                            <img
                              className="postImg"
                              src={post.image}
                              alt="Postimage"
                            />
                          ) : (
                            <div style={{ display: "none" }}></div> // Optional: add a placeholder or leave it empty
                          )}
                          <p className="profilePostBody">{post.body}</p>
                          <div className="profilePostAnalytics">
                              {/* <i
                                style={{ color: "grey" }}
                                className="fa-solid fa-heart"
                              ></i>{" "} */}
                              
                                <span
                                  className="likeBtn"
                                  ref={(el) => (likeBtn.current[index] = el)}
                                  /* Passing in the index for each mapped post
                                    into the addLike Function.
                                  */
                                  onClick={() => addLike(post._id, index)}
                                >
                                  
                                  <i className="fa-solid fa-heart heartIcon"></i>
                                  <span >
                                    {" "}
                                    {post.likes.length}
                                  </span>
                                </span>
                            <div style={{ color: "grey" }} className="profileCommentFlex">
                              <CommentMoodle
                                postSubject={post.subject}
                                postBody={post.body}
                                poster={post.poster}
                                postCreationDate={post.postCreationDate}
                                postID={post._id}
                                keyOfPost={index}
                                postLikesCount={post.likes.length}
                                postComments={post.comments}
                                image={post.image}
                                posterProfilePic={post.posterProfilePic}
                                showPostDate={showPostDate}
                                currentActiveUser={loggedInUserBaseInformation.userName}

                                 // for updating the feed after a comment is made
                                // updateMainFeed={getUserProfilePosts}
                                updateMainFeed={getUserProfilePosts}
                                
                              />
                              <ShowLikes
                                post={post}
                                />
                            </div>
                          </div>
                        </article>
                      </>
                    );
                  })
                ) : (
                  // if there is no posts made by the user in question in that specific comminui
                  <div className="noPostsMessage">
                    <h3>{userProfileData.user} hasn't posted anything here yet!</h3>
                    <p>Get them to share something! 😃</p>
                  </div>
                )}
              </>
            ) : (
              <div className="noPostsMessage">
                <div className=" loader "></div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
