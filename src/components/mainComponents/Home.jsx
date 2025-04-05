import { useState, useEffect, useRef } from "react";
import logo from "/src/assets/wolfLogo.png";
import AboutPost from "../componentDependencies/AboutPost";
import UpdateFeed from "../componentDependencies/UpdateFeed";
import Navbar from "../componentDependencies/NavBar";
import SideNavBar from "../componentDependencies/SideNavbar";
import Suggested from "./Suggested";


export default function Home() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userSearched = urlParams.get("topicFeed");

  // The side navigation element
  const sideNav = useRef(null);

  // and checking user action based off of username
  const [totalMembers, setTotalMembers] = useState(null);

  // The refs for creating posts
  const subjectPostElement = useRef(null);
  const bodyPostElement = useRef(null);

  // User feedBack when invalid input is given
  const [errorMessage, setErrorMessage] = useState("");
  const errorMessageElement = useRef(null);

  // image upload element
  const imageRef = useRef(null);
  const [image, setImage] = useState(null);

  const createPostElement = useRef(null);
  const darkBG = useRef(null);
  const newPostBtn = useRef(null);
  const selectRef = useRef(null);

  // When uploading an image, this is the state that will hold the preview of the image before it is sent to the server
  const [communityImagePreview, setCommunityImagePreview] = useState(null);


  const [loggedInUserInfo, setLoggedInUserInfo] = useState([]); // array of topics the user selected

  // Getting the current logged in user information from the server
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

    // all data is push into state from one array
    setLoggedInUserInfo(homeData)

  }


  // RETRIEVING THE DESCRIPTION THAT COMES WITH EACH COMMUNITY
  async function retrieveCommunityInformation() {
    const response = await fetch("/community/retrieveCommunityInformation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    setTotalMembers(data);
  }


  //  Creating a new post
  async function createNewPost(community) {
    let subject = subjectPostElement.current.value;
    let body = bodyPostElement.current.value;

    // handling to see if either input field is empty
    if (!subject || !body) {
      errorMessageElement.current.style.color = "crimson";
      setErrorMessage("Please enter a subject and body");
      return;
    }

    // checking to see what community the user is posting to

    const imageFile = imageRef.current.files[0];
    const formData = new FormData();
    formData.append("whoPosted", loggedInUserInfo.userName);
    formData.append("postSubject", subject);
    formData.append("postBody", body);
    formData.append("image", imageFile);

    // Sending post to db...
    const responseForPost = await fetch(`/newPost?feed=${community}`, {
      method: "POST",
      body: formData,
    });

    const result = await responseForPost.json();

    if (!responseForPost.ok) {
      throw new Error(`Error posting.. ${responseForPost.status}`);
    }

    // Message to confirm that the post has been to the respective feed
    errorMessageElement.current.style.color = "lime";
    setErrorMessage(`Posted to ${community}`);
    if (community === "Home") {
      setTimeout(() => {
        window.location.href = `/home`;
        errorMessageElement.current.style.color = "lime";
        bodyPostElement.current.value = "";
        subjectPostElement.current.value = "";
      }, 900);
    } else {
      setTimeout(() => {
        errorMessageElement.current.style.color = "lime";
        bodyPostElement.current.value = "";
        subjectPostElement.current.value = "";
        window.location.href = `/home?topicFeed=${community + "Feed"}`;
      }, 900);
    }
  }

  useEffect(() => {
    getUserData()
    retrieveCommunityInformation();
    removeTitle();
  }, []);

  // Mobile nav bar functionality
  function mobileNavFunction() {
    sideNav.current.classList.toggle("toggleNav");
  }

  // The "Whats New Header gets removed when the user is viewing another feed other than the home Feed"
  let whatsNewTitle = useRef(null);
  function removeTitle() {
    if (userSearched) {
      whatsNewTitle.current.style.display = "none";
    }
  }

  const newPostBtnMobile = useRef(null);

  // FOR THE APPEARING AND DISAPPEARING POST CREATING SCREEN
  function appearEffect() {
    // toggling wether it appears or not
    if (createPostElement) {
      darkBG.current.style.opacity = "1";
      darkBG.current.style.pointerEvents = "all";
      createPostElement.current.style.opacity = "1";
      createPostElement.current.style.pointerEvents = "all";
      bodyPostElement.current.value = "";
      subjectPostElement.current.value = "";
      document.body.style.overflow = "hidden";
    }
  }

  // Clicking certain exit buttons and clicking the bg overlay will exit out of menus
  function dissappearEffect() {
    createPostElement.current.style.opacity = "0";
    createPostElement.current.style.pointerEvents = "none";
    bodyPostElement.current.value = "";
    subjectPostElement.current.value = "";
    document.body.style.overflow = "auto";
    darkBG.current.style.opacity = "0";
    darkBG.current.style.pointerEvents = "none";
  }

  // for making the comments section appear and disappear
  function appearEffectComments() {
    darkBG.current.style.opacity = "1";
    darkBG.current.style.pointerEvents = "all";
    document.body.style.overflow = "hidden";
  }

  // side bar refs
  const sidebarRefs = { sideNav };

  // Navbar functionality
  const navbarProps = {
    logo: logo,
    username: loggedInUserInfo.userName,
    mobileNavFunction: () => mobileNavFunction(),
  };

  // sidebar functionality
  const sidebarProps = {
    username: loggedInUserInfo?.userName,
    followings: loggedInUserInfo?.followingCount,
    followers: loggedInUserInfo?.followerCount,
    UID: loggedInUserInfo?.UID,
    profileImage: loggedInUserInfo?.profilePic,
    displayAbout: () => displayAbout(),
  };


  return (
    <>
      {/* NAVBAR */}
      <Navbar {...navbarProps} appearEffect={appearEffect} />

      {/* MAIN CONTENT */}

      <SideNavBar {...sidebarProps} ref={sidebarRefs} />
      <main>
        <span ref={darkBG} id="darkBG"></span>
        <section id="content">
          {/* New post button for desktop with a message with it */}
          <h1 id="whatsNew" ref={whatsNewTitle}>
            What's New
          </h1>
          <span id="newPostBtn" ref={newPostBtn} onClick={() => appearEffect()}>
            Express yourself.
          </span>
          <div id="newPost">
            {/* Floating prompt for creating a new post */}
            <form
              enctype="multipart/form-data"
              ref={createPostElement}
              id="createPostElement"
            >
              <h2 id="createNewPostHeader">
                What's on your mind?{" "}
                <span onClick={() => dissappearEffect()}>
                  <i className="fa-solid fa-x"></i>
                </span>
              </h2>
              <div id="selectCommunity">
                <h2>Which Den?</h2>
                <form>
                  <select ref={selectRef}>
                    {userSearched ? (
                      <option value={userSearched.split("Feed")[0]}>
                        {userSearched.split("Feed")[0]}
                      </option>
                    ) : (
                      <span></span>
                    )}

                    <option value={"Home"}>Home</option>

                    {totalMembers
                      ?.filter((community) =>
                        Object.values(community.members).some(
                          (member) => member.member === loggedInUserInfo.userName
                        )
                      )
                      .map((community) => {
                        return (
                          <>
                            <option value={community.name}>
                              {community.name}
                            </option>
                          </>
                        );
                      })}
                  </select>
                </form>
              </div>
              <div id="formSubject">
                <input
                  maxLength={40}
                  required
                  placeholder="What's it about?"
                  onsubmit="return false"
                  ref={subjectPostElement}
                ></input>
                <br />
              </div>
              <div id="formBody">
                <textarea
                  required
                  placeholder="Tell us more.."
                  onsubmit="return false"
                  ref={bodyPostElement}
                  type="text"
                ></textarea>
              </div>
              <div id="upload">
                Upload a picture
                <img
                  src={communityImagePreview ? communityImagePreview : null}
                  alt="No image selected"
                />
                <input
                  accept="image/*"
                  ref={imageRef}
                  type="file"
                  onChange={() => {
                    // Processing the uploaded photo and getting a preview of what it looks like before the Post is created
                    const file = imageRef.current.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setCommunityImagePreview(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>

              <h4 id="feedbackMessage" ref={errorMessageElement}>
                {errorMessage}
              </h4>
              <button
                type="button"
                onClick={() => createNewPost(selectRef.current.value)}
              >
                Post
              </button>
            </form>
          </div>

          {/* what shows up based on what topics the user selected */}
          <article className="userContent">
            {/* changingFeed will be the dependant topic of the user feed*/}
            <UpdateFeed
              currentActiveUser={loggedInUserInfo.userName}
              bgEffect={appearEffectComments}
              removeBGEffect={dissappearEffect}
              image={image}
              ref={darkBG}
            />{" "}
            {/*  Updating the feed with the newest posts*/}
          </article>
        </section>
        <Suggested />
      </main>
    </>
  );
}
