import { forwardRef, useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../componentDependencies/NavBar";
import SideNavBar from "../componentDependencies/SideNavbar";
import defaultProfilePic from '/src/assets/defaultUser.png';

export default function Profile(props) {
  // Strictly holds the quick access information of the logged in user
  const [loggedInUserBaseInformation, setLoggedInUserBaseInformation] = useState([])

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

      const homeData = await response.json();
      // setting the user info needed as one useState
      setLoggedInUserBaseInformation(homeData)

    }

    getUserData();
  }, []);



  // Getting the post data from the user
  const [profilePostData, setProfilePostData] = useState(null);
  const [userProfileData, setUserProfileData] = useState([]);

  // Moodle set up
  const [dynamicUsername, setDynamicUsername] = useState(null);
  const [dynamicFollowingArr, setDynamicFollowingArr] = useState(null);
  const [dynamicFollowerArr, setDynamicFollowerArr] = useState(null);
  const [dynamicUID, setDynamicUID] = useState(null);
  const [dynamicBio, setDynamicBio] = useState(null);
  const [dynamicProfilePic, setDynamicProfilePic] = useState(null);

  /*
      Gets User information based on what user is selected from the query string
      On the main feed page, the user can be selected by post click or seeing them in the
      members moodle for a particular community
    */
  async function getUserProfilePosts(feedView = "mainFeed") {
    try {
      const response = await fetch(
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
      setProfilePostData(postData.profilePostData.reverse() || []);
      // sending back the userdata for the searched user

      // The userData that gets returned based on the UID
      // all based on whos profile the user is looking at
      setUserProfileData(postData.userData || []);
      setDynamicProfilePic(postData.userData.profilePic);
      setDynamicFollowerArr(postData.userData.followers);
      setDynamicFollowingArr(postData.userData.following);
      setDynamicProfileFeed(feedView);

      // The username that the UID has in store
      setDynamicUsername(postData.userData.user);

      setDynamicUID(postData.userData.UID);
      setDynamicBio(postData.userData.userBio);
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

  const followBtnRef = useRef(null);

  // queryStringUser is the user looked up via query string
  // and comparing it to the uuid of the logged in user

  const [displayFollowing, setDisplayFollowing] = useState(false);

  // helper function
  const displayFollow = (bool) => {
    setDisplayFollowing(bool);
  };

  const [communities, setCommunities] = useState(null);

  // poster is used to find the corresponding profile for the poster
  async function navigateToProfile(user) {
    const response = await fetch(`/profileData/getID?poster=${user}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // The data returns the fetched user uid
    window.location.href = `/profile?user=${data.userUID}`;
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

  //  Styling helper function to change the appearance
  const switchToEnter = () => {
    // Styling changes
    bioElementDisplay.current.style.display = "none";
    bioElementEnter.current.style.display = "block";
    bioElementEnter.current.value = dynamicBio;
    changeBioBtn.current.style.display = "none";
    updateBioBtn.current.style.display = "block";
  };

  async function addProfileBio() {
    // Value of the profile bio
    // let bioDisplay = bioElementDisplay.current.value

    if (bioEnter.current.value === "") {
      bioElementDisplay.current.value = dynamicBio;
      return;
    }

    // Server calls
    let response = await fetch(`/updateBio/${dynamicUID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newBio: bioEnter.current.value }),
    });

    if (!response.ok) {
      throw new Error("Could not change bio");
    }

    // Styling changes
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
  const [isFollowing, setIsFollowing] = useState(false);

  // Checks to see if the loggedInUser is already following the target user
  function checkFollowing() {
    if (userProfileData?.followers?.includes(loggedInUserBaseInformation.userName)) {
      followBtn.current.style.display = "none";
      unfollowBtn.current.style.display = "block";
    }
  }

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

  //  User clicks and it brings up 2 moodles one with the comment section and another with the content

  // All of the post information saved as state for each indiviual post depending on what the user clicks on
  const [postPoster, setPostPoster] = useState(null);
  const [postCreationDateState, setPostCreationDateState] = useState(null);
  const [postSubjectState, setPostSubjectState] = useState(null);
  const [postBodyState, setPostBodyState] = useState(null);
  const [likesLength, setLikesLength] = useState(null);
  const [commentsLength, setCommentsLength] = useState(null);
  const [postComments, setPostComments] = useState(null);
  const [profilePostID, setProfilePostID] = useState(null);
  const [dynamicProfileFeed, setDynamicProfileFeed] = useState(null);
  const [profilePostLikes, setProfilePostLikes] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [posterProfilePic, setPosterProfilePic] = useState(null);

  const moodleContainerRef = useRef();
  const profilePostCommentRef = useRef();
  const postCommentsLikeRef = useRef();
  const overlay = useRef();
  const feedback = useRef();

  const showProfilePostDetails = (
    postID,
    poster,
    creationDate,
    subject,
    body,
    likesLength,
    commentsLength,
    comments,
    likes,
    image,
    posterProfilePic
  ) => {
    setPostPoster(poster);
    setPostCreationDateState(creationDate);
    setPostSubjectState(subject);
    setPostBodyState(body);
    setLikesLength(likesLength);
    setCommentsLength(commentsLength);
    setPostComments(comments);
    setProfilePostID(postID);
    setProfilePostLikes(likes);
    setPostImage(image);
    setPosterProfilePic(posterProfilePic);

    moodleContainerRef.current.style.display = "flex";
    moodleContainerRef.current.style.pointerEvents = "all";
    document.body.style.overflow = "hidden";
    overlay.current.style.display = "block";
    overlay.current.style.pointerEvents = "all";

    getUserProfilePosts();
  };

  async function profilePostComment(textareaValue) {
    if (profilePostCommentRef.current.value === "") {
      feedback.current.style.color = `red`;
      feedback.current.innerHTML = `Can't leave an empty comment!`;

      setTimeout(() => {
        feedback.current.style.color = "white";
        feedback.current.innerHTML = "";
      }, 2500);

      return;
    }

    let response = await fetch(
      `/addPostComment?postID=${profilePostID}&feed=${dynamicProfileFeed}&commentFrom=${loggedInUserBaseInformation.userName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: textareaValue }),
      }
    );

    // giving feedback
    profilePostCommentRef.current.value = "";
    feedback.current.style.color = "lime";
    feedback.current.innerHTML = "Posted Comment!";

    setTimeout(() => {
      feedback.current.style.color = "white";
      feedback.current.innerHTML = "";
    }, 2500);

    // refresh post data
    getUserProfilePosts();
    // showProfilePostDetails(postID, postPoster, postCreationDateState, postSubjectState, postBodyState, likesLength, commentsLength, postComments)
  }

  async function profileAddLike(profilePostID, likes) {
    if (postCommentsLikeRef.current.style.color === "white") {
      postCommentsLikeRef.current.style.color = "red";
    } else {
      postCommentsLikeRef.current.style.color = "white";
    }

    let response = await fetch(`/addLike?feed=${dynamicProfileFeed}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postID: profilePostID, loggedInUser: loggedInUserBaseInformation.userName }),
    });

    getUserProfilePosts();
  }

  const sidebarProps = {
    username: loggedInUserBaseInformation.userName,
    followings: loggedInUserBaseInformation.followingCount,
    followers: loggedInUserBaseInformation.followerCount,
    UID: loggedInUserBaseInformation.UID,
    profileImage: loggedInUserBaseInformation.profilePic,
  };


  function backOut() {
    moodleContainerRef.current.style.display = "none";
    moodleContainerRef.current.style.pointerEvents = "none";
    document.body.style.overflow = "auto";
    overlay.current.style.display = "none";
    overlay.current.style.pointerEvents = "none";
  }

  function navigateToFollowingPage(UID) {
    window.location.href = `/followerPage?following=${UID}`;
  }

  function navigateToFollowersPage(UID) {
    window.location.href = `/followerPage?followers=${UID}`;
  }

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

    // setUpdateMessage("Profile Picture Changed!")
    // await getUserProfilePosts()
  }

  // Displaying profile picture, username and follower information
  function checkUserType() {
    switch (dynamicUsername) {
      // For developers
      case "Samuel":
        return (
          <>
            <div id="iconAndUsername">
              {/* <i className="fa-solid fa-user"></i> */}
              <section id="picContainer">
                <img
                  src={
                    dynamicProfilePic
                      ? dynamicProfilePic
                      : defaultProfilePic
                  }
                  alt=""
                  id="profilePicture"
                />
                <div id="whoAmI">
                  <h5>{dynamicUsername}</h5>
                  {userSearched === loggedInUserBaseInformation.UID ? (
                    <div id="changeOverlay">
                      <p>Change Picture</p>
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
                  <p id="updateMessage">{updateMessage}</p>
                </div>
              </section>

              <div id="followTracking">
                {userSearched === loggedInUserBaseInformation.UID ? (
                  <>
                    <section
                      onClick={() => navigateToFollowersPage(loggedInUserBaseInformation.UID)}
                    >
                      <h3>{dynamicFollowerArr?.length}</h3>
                      <p>Followers</p>
                    </section>
                    <section
                      onClick={() => navigateToFollowingPage(loggedInUserBaseInformation.UID)}
                    >
                      <h3>{dynamicFollowingArr?.length}</h3>
                      <p>Following</p>
                    </section>
                  </>
                ) : (
                  <>
                    <section
                      onClick={() => navigateToFollowersPage(dynamicUID)}
                    >
                      <h3>{dynamicFollowerArr?.length}</h3>
                      <p>Followers</p>
                    </section>
                    <section
                      onClick={() => navigateToFollowingPage(dynamicUID)}
                    >
                      <h3>{dynamicFollowingArr?.length}</h3>
                      <p>Following</p>
                    </section>
                  </>
                )}
              </div>
            </div>
          </>
        );
      // For regular users
      default:
        return (
          <>
            <div id="iconAndUsername">
              <section id="picContainer">
                <img
                  src={
                    dynamicProfilePic
                      ? dynamicProfilePic
                      : defaultProfilePic
                  }
                  alt=""
                  id="profilePicture"
                />
                <div id="whoAmI">
                  <h5>{dynamicUsername}</h5>
                  {userSearched === loggedInUserBaseInformation.UID ? (
                    <div id="changeOverlay">
                      <p>Change Picture</p>
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
                  <p id="updateMessage">{updateMessage}</p>
                </div>
              </section>

              <div id="followTracking">
                {userSearched === loggedInUserBaseInformation.UID ? (
                  <>
                    <section
                      onClick={() => navigateToFollowersPage(loggedInUserBaseInformation.UID)}
                    >
                      <h3>{dynamicFollowerArr?.length}</h3>
                      <p>Followers</p>
                    </section>
                    <section
                      onClick={() => navigateToFollowingPage(loggedInUserBaseInformation.UID)}
                    >
                      <h3>{dynamicFollowingArr?.length}</h3>
                      <p>Following</p>
                    </section>
                  </>
                ) : (
                  <>
                    <section
                      onClick={() => navigateToFollowersPage(dynamicUID)}
                    >
                      <h3>{dynamicFollowerArr?.length}</h3>
                      <p>Followers</p>
                    </section>
                    <section
                      onClick={() => navigateToFollowingPage(dynamicUID)}
                    >
                      <h3>{dynamicFollowingArr?.length}</h3>
                      <p>Following</p>
                    </section>
                  </>
                )}
              </div>
            </div>
          </>
        );
    }
  }

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

  return (
    <>
      <Navbar />
      <SideNavBar {...sidebarProps} />
      <span ref={overlay} id="overlayProfile" onClick={() => backOut()}></span>
      <div id="contentContainer">
        <main id="mainProfile">
          <h2 className="profHeaders">Profile </h2>
          <div className="profileAnalytics">
            {/* Checks for the type of user is being displayed */}
            {checkUserType()}

            {/*  FOLLOW SYSTEM */}

            <section id="followBtnPair" ref={followBtnPair}>
              {showFollowBtns()}
            </section>

            {/* BIO SYSTEM */}
            <div id="bioPair">
              <div id="bioTitle">
                <h3>Bio</h3>
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
              <br />

              {/* This is the version on the bio is for when the user enters a new or edited bio */}
              <span id="userEnterBio" ref={bioElementEnter}>
                <textarea
                  ref={bioEnter}
                  maxLength={300}
                  placeholder={dynamicBio}
                >
                  {dynamicBio}
                </textarea>
              </span>

              {/* This is the version on the bio is is strictly for display  */}
              <span id="profileBio" ref={bioElementDisplay}>
                {dynamicBio}
              </span>
            </div>
          </div>

          {/*PROFILE POST COMMNENT SYSTEM  */}
          <article id="moodleContainer" ref={moodleContainerRef}>
            <span id="postMoodle1">
              <div id="moodleTitle">
                <section>
                  <img src={posterProfilePic} alt="" />
                  <h1>{postPoster}</h1>
                  <p>{showPostDate(postCreationDateState)}</p>
                </section>
                <button id="backBtn" onClick={() => backOut()}>
                  <i class="fa-solid fa-x"></i>
                </button>
              </div>

              <div id="moodleContent">
                <h3>{postSubjectState}</h3>
                {postImage ? (
                  <img src={postImage} alt="Postimage" />
                ) : (
                  <div style={{ display: "none" }}></div> // Optional: add a placeholder or leave it empty
                )}
                <p>{postBodyState}</p>
              </div>

              <div id="moodleInteraction">
                <button
                  id="profileBtnLikeBtn"
                  onClick={() =>
                    profileAddLike(profilePostID, profilePostLikes)
                  }
                >
                  {profilePostLikes?.includes(loggedInUserBaseInformation.userName) ? (
                    <>
                      <i
                        ref={postCommentsLikeRef}
                        style={{ color: "red" }}
                        className="fa-solid fa-heart"
                      ></i>
                    </>
                  ) : (
                    <i
                      ref={postCommentsLikeRef}
                      style={{ color: "white" }}
                      className="fa-solid fa-heart"
                    ></i>
                  )}
                  Like
                </button>
                <h4>
                  <i className="fa-regular fa-heart"></i> {likesLength}
                </h4>
              </div>

              <span id="mobilePostMoodle">
                {postComments?.length > 0 ? (
                  <>
                    <div id="commentSection">
                      {postComments
                        ?.map((comment) => {
                          return (
                            <>
                              <div className="commentContainer">
                                <div className="commentTitle">
                                  <span>
                                    <img
                                      src={
                                        comment.commenterProfilePicImg
                                          ? comment.commenterProfilePicImg
                                          : defaultProfilePic
                                      }
                                      alt=""
                                    />
                                    <h4>{`${comment.from}`} </h4>
                                    <p>{showPostDate(comment.timePosted)}</p>
                                  </span>
                                </div>
                                <p>{comment.comment}</p>
                              </div>
                            </>
                          );
                        })
                        .reverse()}
                    </div>
                  </>
                ) : (
                  <div className="noPostsMessage">
                    <h3>No comments available yet!</h3>
                    <p>Be the first to leave a comment here! 🗣️</p>
                  </div>
                )}

                <h4 ref={feedback} id="feedback"></h4>
                <div id="profileCommentInputField">
                  <textarea
                    ref={profilePostCommentRef}
                    placeholder="Add a comment..."
                  ></textarea>
                  <button
                    id="postProfileComment"
                    onClick={() =>
                      profilePostComment(profilePostCommentRef.current.value)
                    }
                  >
                    Send
                  </button>
                </div>
              </span>
            </span>

            {/* For Comments */}
            <span id="postMoodle2">
              {/* <div id="backBtnContainer">
                        <h3>Comments</h3>
                        <button id="backBtn" onClick={()=> backOut()}><i class="fa-solid fa-x"></i></button>
                     </div> */}

              {postComments?.length > 0 ? (
                <>
                  <div id="commentSection">
                    {postComments
                      ?.map((comment) => {
                        return (
                          <>
                            <div className="commentContainer">
                              <div className="commentTitle">
                                <span>
                                  <img
                                    src={
                                      comment.commenterProfilePicImg
                                        ? comment.commenterProfilePicImg
                                        : defaultProfilePic
                                    }
                                    alt=""
                                  />
                                  <h4>{`${comment.from}`}</h4>
                                  <p>{showPostDate(comment.timePosted)}</p>
                                </span>
                              </div>
                              <p>{comment.comment}</p>
                            </div>
                          </>
                        );
                      })
                      .reverse()}
                  </div>
                </>
              ) : (
                <div className="noPostsMessage">
                  <h3>No comments available yet!</h3>
                  <p>Be the first to leave a comment here! 🗣️</p>
                </div>
              )}

              <h4 ref={feedback} id="feedback"></h4>
              <div id="profileCommentInputField">
                <textarea
                  ref={profilePostCommentRef}
                  placeholder="Add a comment..."
                ></textarea>
                <button
                  id="postProfileComment"
                  onClick={() =>
                    profilePostComment(profilePostCommentRef.current.value)
                  }
                >
                  Comment
                </button>
              </div>
            </span>
          </article>

          <div className="totalPosts">
            <section className="profHeaders">
              <h3>Posts </h3>
              <form>
                {/* The dropdown selection menu that displays topics that the user is currently apart of  */}
                <select
                  className="topicDisplaySelection"
                  onChange={(e) => getUserProfilePosts(e.target.value)}
                >
                  <option
                    onClick={() => getUserProfilePosts("mainFeed")}
                    value="mainFeed"
                  >
                    Home Feed
                  </option>
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
                          onClick={() =>
                            showProfilePostDetails(
                              post._id,
                              dynamicUsername,
                              post.postCreationDate,
                              post.subject,
                              post.body,
                              post.likes.length,
                              post.comments.length,
                              post.comments,
                              post.likes,
                              post.image,
                              post.posterProfilePic
                            )
                          }
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
                            <h4>{dynamicUsername} </h4>
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
                            <h5>
                              <i
                                style={{ color: "grey" }}
                                className="fa-solid fa-heart"
                              ></i>{" "}
                              {post.likes.length}
                            </h5>
                            <h5 style={{ color: "grey" }}>
                              <i
                                style={{ color: "grey" }}
                                className="fa-solid fa-comments"
                              ></i>{" "}
                              {post.comments.length}
                            </h5>
                          </div>
                        </article>
                      </>
                    );
                  })
                ) : (
                  // if there is no posts made by the user in question in that specific comminui
                  <div className="noPostsMessage">
                    <h3>{dynamicUsername} hasn't posted anything here yet!</h3>
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
