import { memo } from "react";
import { useState, useEffect, useRef } from "react";
import defaultProfilePic from "/src/assets/defaultUser.png";

export default function Suggested() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // the querystring definition that will determine what featured members are there
  const determinedCommunity = urlParams.get("topicFeed");

  const suggestedNavRef = useRef(null);
  const suggestedNavMembersRef = useRef(null);

  const [allCommunities, setAllCommunities] = useState(null);
  const [loggedInUserInfo, setLoggedInUserInfo] = useState([]);

  // Gettting the logged in user information to show the join/leave button for communities
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

    setLoggedInUserInfo(homeData);
  }

  // Fetching All communities
  async function getCommunityInformation() {
    let response = await fetch("/community/retrieveCommunityInformation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data = await response.json();
    setAllCommunities(data);
    // console.log(data)
  }

  // poster is used to find the corresponding profile for the poster
  async function navigateToProfile(poster) {
    const response = await fetch(`/profileData/getID?poster=${poster}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    // The data returns the fetched user uid
    window.location.href = `/profile?user=${data.userUID}`;
    /* setTimeout(() => {
   }, 500); */
  }

  const suggestedJoinBtnRef = useRef();

  // Function to join a topic/leave a community
  async function joinTopic(topicName, key) {
    try {
      const response = await fetch(
        `/topicsAdd?loggedInUser=${loggedInUserInfo.UID}&topicToAdd=${topicName}&username=${loggedInUserInfo.userName}`,
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
      if (suggestedJoinBtnRef.current.innerHTML === "Leave Den") {
        suggestedJoinBtnRef.current.innerHTML = `Join ${
          determinedCommunity.split("Feed")[0]
        }`;
      } else {
        suggestedJoinBtnRef.current.innerHTML = "Leave Den";
      }
    } catch {
      throw new Error("Could not send the join req");
    }
  }

  function determineIfUserJoined() {
    // determine if the user has joined a selected community or not
    let currentCommunity = allCommunities?.find(
      (community) => community.name === determinedCommunity?.split("Feed")[0]
    );

    if (
      //If the logged in user is found in a community's members list then the btn to leave will appear
      currentCommunity?.members.find(
        (member) => member.member === loggedInUserInfo.userName
      )
    ) {
      return (
        <>
          <button
            id="suggestJoinBtn"
            ref={suggestedJoinBtnRef}
            onClick={() => joinTopic(determinedCommunity.split("Feed")[0])}
          >
            Leave Den
          </button>
        </>
      );
    } else {
      return (
        <>
          {/* If the user has not joined the community then show the join button */}
          {determinedCommunity ? (
            <button
              id="suggestJoinBtn"
              ref={suggestedJoinBtnRef}
              onClick={() => joinTopic(determinedCommunity.split("Feed")[0])}
            >
              Join {determinedCommunity.split("Feed")[0]}
            </button>
          ) : (
            <span></span>
          )}
        </>
      );
    }
  }

  function disableShowMembersOfCommunityContainer() {
    suggestedNavRef.current.style.display = "none"; // hide the members container if there is no community to show
  }

  useEffect(() => {
    getCommunityInformation();
    getUserData();
    determineIfUserJoined();
  }, []);

  return (
    <>
      <section id="suggestedContainer">
        <nav id="showMembersOfCommunityContainer" ref={suggestedNavRef}>
          {determinedCommunity ? (
            <>
              <ul id="suggestedNavMembers" ref={suggestedNavMembersRef}>
                {allCommunities ? determineIfUserJoined() : <span></span>}
                {/* <h3>{determinedCommunity?.split("Feed")[0]} Den Members</h3> */}
                {allCommunities ? (
                  allCommunities
                    ?.filter(
                      (community) =>
                        community?.name ===
                        determinedCommunity?.split("Feed")[0]
                    )
                    .map((community) => {
                      return community.members.length > 0 ? (
                        <ul key={community.name}>
                          {Object.entries(community.members).map(
                            ([key, value]) => (
                              <>
                                <div key={key}>
                                  <section>
                                    <div className="nameAndImageContainer">
                                      <img
                                        className=""
                                        src={
                                          value.memberProfilePic
                                            ? value.memberProfilePic
                                            : defaultProfilePic
                                        }
                                        alt=""
                                      />
                                      <h4 className="memberNames">
                                        {value.member}
                                      </h4>
                                    </div>

                                    <button
                                      onClick={() =>
                                        navigateToProfile(value.member)
                                      }
                                    >
                                      Profile
                                    </button>
                                  </section>
                                </div>
                              </>
                            )
                          )}
                        </ul>
                      ) : (
                        <div className="noPostsMessage">
                          <h3>No members</h3>
                        </div>
                      );
                    })
                ) : (
                  <div className="noPostsMessage">
                    <div className=" loader "></div>
                  </div>
                )}
              </ul>
            </>
          ) : (
            // for the home page
            <span></span>
          )}
        </nav>

        <h3 className="sideHeaders">Dens you might like</h3>
        <nav id="suggestedCommunities">
          {/* Shuffles through all possible communities and shows 5 random communities that the user can join */}
          {/* Determined community is decided on wether or not there is query string.
            If there is a query string then it will show the members of that selected community
            otherwise it will show random communities from the list of all communities.
          */}


          {allCommunities ? (
            determinedCommunity
              ? allCommunities
                  ?.sort(() => 0.5 - Math.random())
                  .slice(0, 5)
                  .map((community) => {
                    return (
                      <>
                        <div>
                          <section>
                            <div className="nameAndImageContainer">
                              <img
                                src={
                                  community.image
                                    ? community.image
                                    : "src/assets/wolfLogo.png"
                                }
                                alt=""
                              />
                              <h4 className="memberNames">{community.name} </h4>
                            </div>

                            <button
                              onClick={() =>
                                (window.location.href = `/home?topicFeed=${
                                  community.name + "Feed"
                                }`)
                              }
                              style={{ color: "turquoise", cursor: "pointer" }}
                            >
                              Visit
                            </button>
                          </section>
                        </div>
                      </>
                    );
                  })
              : allCommunities
                  ?.sort(() => 0.5 - Math.random())
                  .slice(0, 5)
                  .map((community) => {
                    return (
                      <>
                        <div>
                          <section>
                            <div className="nameAndImageContainer">
                              <img
                                src={
                                  community.image
                                  ? community.image
                                  : "src/assets/wolfLogo.png"
                                }
                                alt=""
                              />
                              <h4 className="memberNames">{community.name} </h4>
                            </div>
                            <button
                              onClick={() =>
                                (window.location.href = `/home?topicFeed=${
                                  community.name + "Feed"
                                }`)
                              }
                              style={{ color: "turquoise", cursor: "pointer" }}
                            >
                              Visit
                            </button>
                          </section>
                        </div>
                      </>
                    );
                  })

          ) : (
            <div className="noPostsMessage">
              <div className=" loader "></div>
            </div>
          )}
        </nav>
      </section>
    </>
  );
}
