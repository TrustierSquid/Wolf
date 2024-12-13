import { memo } from "react";
import { useState, useEffect, useRef } from "react";

export default function Suggested() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // the querystring definition that will determine what featured members are there
  const determinedCommunity = urlParams.get("topicFeed");

  const [allCommunities, setAllCommunities] = useState(null);
  const suggestedNavRef = useRef(null);
  const suggestedNavMembersRef = useRef(null);
  const [communityMemberData, setCommunityMemberData] = useState(null);
  const [loggedInUID, setLoggedInUID] = useState(null);
  const [userTopicArray, setUserTopicArray] = useState(null);
  const [followerCount, setFollowerCount] = useState(null);
  const [followingCount, setFollowingCount] = useState(null);
  const [username, setUsername] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

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
    setUserTopicArray(homeData.topicArr);

    // the current user logged in
    setUsername(homeData.userName);

    //  the current users following count
    setFollowingCount(homeData.followingCount.length);

    // the current users follower count
    setFollowerCount(homeData.followerCount.length);

    setProfilePicture(homeData.profilePic);
  }

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

  async function joinTopic(topicName, key) {
    try {
      const response = await fetch(
        `/topicsAdd?loggedInUser=${loggedInUID}&topicToAdd=${topicName}&username=${username}`,
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
    let currentCommunity = allCommunities?.find(
      (community) => community.name === determinedCommunity?.split("Feed")[0]
    );

    if (
      currentCommunity?.members.find((member) => member.member === username)
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
  useEffect(() => {
    getCommunityInformation();
    getUserData();
    determineIfUserJoined();
  }, []);

  return (
    <>
      <nav id="suggestedNav" ref={suggestedNavRef}>
        {determinedCommunity ? (
          <>
            <ul id="suggestedNavMembers" ref={suggestedNavMembersRef}>
              {allCommunities ? determineIfUserJoined() : <span></span>}
              <h3>{determinedCommunity?.split("Feed")[0]} Den Members</h3>
              {allCommunities ? (
                allCommunities
                  ?.filter(
                    (community) =>
                      community?.name === determinedCommunity?.split("Feed")[0]
                  )
                  .map((community) => {
                    return community.members.length > 0 ? (
                      <ul key={community.name}>
                        {Object.entries(community.members).map(
                          ([key, value]) => (
                            <>
                              <div key={key}>
                                <section>
                                  <img
                                    className=""
                                    src={
                                      value.memberProfilePic
                                        ? value.memberProfilePic
                                        : "src/assets/defaultUser.jpg"
                                    }
                                    alt=""
                                  />
                                  <h4 className="memberNames">
                                    {value.member}
                                  </h4>
                                  <button
                                    onClick={() =>
                                      navigateToProfile(value.member)
                                    }
                                  >
                                    View Profile
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
        <br />
        <h3>Dens you might like</h3>
        {determinedCommunity
          ? allCommunities
              ?.sort(() => 0.5 - Math.random())
              .slice(0, 5)
              .map((community) => {
                return (
                  <>
                    <div>
                      <section>
                        <img
                          src={
                            community.image
                              ? community.image
                              : "src/assets/wolfLogo.png"
                          }
                          alt=""
                        />
                        <h4 className="memberNames">{community.name} |</h4>
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
                        <img
                          src={
                            community.image
                              ? community.image
                              : "src/assets/wolfLogo.png"
                          }
                          alt=""
                        />
                        <h4 className="memberNames">{community.name} |</h4>
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
              })}
      </nav>
    </>
  );
}
