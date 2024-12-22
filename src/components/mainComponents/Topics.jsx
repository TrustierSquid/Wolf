import { useState, useEffect, useRef } from "react";
import Navbar from "../componentDependencies/NavBar";
import SideNavBar from "../componentDependencies/SideNavbar";

export default function Topics(props) {
  const [topics, setTopics] = useState([]);
  const cardBtnRef = useRef([]);

  async function getTopics() {
    try {
      const response = await fetch("/api/topics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setTopics(data.topics);
    } catch {
      console.log("Failed to get Topics");
    }
  }

  const [joinedTopicsState, setJoinedTopicsState] = useState([]);
  const [membersCount, setMembersCount] = useState(null);
  const isJoinedBtn = useRef([]);
  const [totalMembers, setTotalMembers] = useState(null);

  // toggles weather or not you join a topic or leave one
  async function joinTopic(topicName, key) {
    try {
      const response = await fetch(
        `/topicsAdd?loggedInUser=${props.loggedInUID}&topicToAdd=${topicName}&username=${props.username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Response was not okay!");
      }

      // Dynamically show if the user has joined the community or not
      if (isJoinedBtn.current[key].innerHTML === "Joined ✅") {
        isJoinedBtn.current[key].innerHTML = "Join";
      } else {
        isJoinedBtn.current[key].innerHTML = "Joined ✅";
      }
    } catch {
      throw new Error("Could not send the join req");
    }
  }

  // Showing the users joined topics and displaying them

  // Gets the total amount of possible topics
  async function retrieveCommunityInformation() {
    let response = await fetch("/community/retrieveCommunityInformation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const memberData = await response.json();

    setTotalMembers(memberData);
  }

  useEffect(() => {
    retrieveCommunityInformation();
  }, [topics, props.loggedInUID]);

  useEffect(() => {
    getTopics();
  }, []);

  // go to home page for user
  function reDirectToHome() {
    window.location.href = `/home`;
  }

  const communityNameRef = useRef();
  const pictureRef = useRef(null);
  const communityDescription = useRef();
  const darkBG = useRef();
  const errorMessageRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Create a new community
  async function createCommunity() {
    const communityImg = pictureRef.current.files[0];
    let modifiedCommunityName = communityNameRef.current.value
      .split(" ")
      .join("");

    // Staging form data to be sent to the server
    let formData = new FormData();
    formData.append("communityName", modifiedCommunityName);
    formData.append("communityDescription", communityDescription.current.value);
    formData.append("communityImage", communityImg);

    if (communityNameRef.current.value === "") {
      errorMessageRef.current.style.color = "red";
      setErrorMessage("Please enter a name for your community.");
      return;
    }

    // sending created community to the server
    let response = await fetch(`/community/create/${props.loggedInUID}`, {
      method: "POST",
      body: formData,
    });

    // sends back a bool indicating if the community already exists or not
    const data = await response.json();
    if (data.existingCommunityCheck) {
      errorMessageRef.current.style.color = "red";
      setErrorMessage("The community you are creating already exists. ");
    } else {
      errorMessageRef.current.style.color = "lime";
      setErrorMessage("Successfully Created Community!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  }

  const communityMoodle = useRef(null);
  const [communityImagePreview, setCommunityImagePreview] = useState(null);

  // Animation for when the "Create Community Button" is clicked
  function openMoodle(action) {
    if (action === "open") {
      communityMoodle.current.style.display = "flex";
      darkBG.current.style.opacity = "1";
      darkBG.current.style.pointerEvents = "all";
      document.body.style.overflow = "hidden";
    } else {
      communityMoodle.current.style.display = "none";
      darkBG.current.style.opacity = "0";
      darkBG.current.style.pointerEvents = "none";
      document.body.style.overflow = "auto";
    }

    if (action === "closeMoodle") {
      darkBG.current.style.opacity = "0";
      communityMoodle.current.style.display = "none";
      darkBG.current.style.pointerEvents = "none";
      document.body.style.overflow = "auto";
    }
  }

  return (
    <>
      <Navbar />
      <SideNavBar {...props.sidebarProps} />
      <span
        ref={darkBG}
        id="darkBG"
        onClick={() => openMoodle("closeMoodle")}
      ></span>
      <article ref={communityMoodle} id="createCommunityMoodle">
        <nav id="communityMoodleNav">
          <h2>Create a Den</h2>
          <button id="exitCommunityMoodle" onClick={() => openMoodle("close")}>
            <i className="fa-solid fa-x"></i>
          </button>
        </nav>

        <p>Den Picture:</p>
        <form id="givePicture">
          <img
            src={
              communityImagePreview
                ? communityImagePreview
                : "src/assets/wolfLogo.png"
            }
            alt=""
          />
          <input
            accept="image/*"
            ref={pictureRef}
            type="file"
            onChange={() => {
              // Processing the uploaded photo and getting a preview of what it looks like before the community is created
              const file = pictureRef.current.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () =>
                  setCommunityImagePreview(reader.result);
                reader.readAsDataURL(file);
              }
            }}
          />
        </form>

        <form id="giveName">
          <label>Den Name:</label>
          <input
            required
            placeholder="ex. Gaming..."
            type="text"
            ref={communityNameRef}
          />
        </form>

        <form id="giveDescription">
          <label>Den Description:</label>
          <input
            required
            maxLength={100}
            placeholder="ex. Converse about the latest trends in gaming..."
            type="text"
            ref={communityDescription}
          />
        </form>

        <br />
        <div id="giveBtnContainer">
          <button id="initCommunity" onClick={() => createCommunity()}>
            Create
          </button>
          <p className="errorMessage" ref={errorMessageRef}>
            {errorMessage}
          </p>
        </div>
      </article>

      <main id="topicsContainer">
        {/* <p id="pageSubHeader">Browse and participate in these communities</p> */}

        <main>
          {/* <h1 id="pageHeader">Join a <span>community</span> that interests you.</h1> */}
          <nav id="pageNavigation">
            <h1 id="pageHeader">Communities</h1>
            <button id="createCommunityBtn" onClick={() => openMoodle("open")}>
              Create Den <i class="fa-solid fa-people-group"></i>
              <i className="fa-solid fa-plus"></i>
            </button>
          </nav>

          <div id="topicSelect">
            <section id="communityGridContainer">
              {totalMembers ? (
                <>
                  {totalMembers
                    ?.sort((a, b) => a.name > b.name)
                    .map((topic, key) => {
                      const isJoined = topic.members.find(
                        (member) => member.member === props.username
                      );

                      return (
                        <>
                          <div key={topic.name} className="topicSelectionBtn">
                            <div className="topicHeader">
                              <div className="communityTitle">
                                <img
                                  src={
                                    topic.image
                                      ? topic.image
                                      : "src/assets/wolfLogo.png"
                                  }
                                  alt=""
                                />
                                <div id="showOwner">
                                  <div className="communityCardTitle">
                                    <h4>{topic.name}</h4>
                                    <h5 style={{ color: "lightgrey" }}>
                                      Owner:{" "}
                                      {topic.owner ? topic.owner : "Wolf Team"}
                                    </h5>
                                    <h5 style={{ color: "magenta" }}>
                                      {topic.members.length} members
                                    </h5>
                                  </div>
                                  <div className="communityCardDescription">
                                    <p style={{ color: "grey" }}>
                                      Created on:{" "}
                                      {topic.creationDate
                                        ? topic.creationDate
                                        : "8/20/24"}
                                    </p>
                                    <p>
                                      {topic.communityDescription
                                        ? topic.communityDescription
                                        : "Launch Community"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* {displayJoinBtn(topic.name, key)} */}
                            <button
                              ref={(ele) => (isJoinedBtn.current[key] = ele)}
                              className="communityJoinBtn"
                              onClick={() => {
                                joinTopic(topic.name, key);
                              }}
                            >
                              {isJoined ? "Joined ✅" : "Join"}
                            </button>
                          </div>
                        </>
                      );
                    })}
                </>
              ) : (
                <div className="noPostsMessage">
                  <div className=" loader "></div>
                </div>
              )}
            </section>
          </div>
        </main>
      </main>
    </>
  );
}
