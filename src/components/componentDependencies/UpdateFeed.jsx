import { useEffect, useState, useRef, forwardRef } from "react";
import logo from "/src/assets/wolfLogo.png";
import ShowLikes from "../moodleComponents/ShowLikes";
import CommentMoodle from "../moodleComponents/CommentMoodle";
import defaultProfilePic from '/src/assets/defaultUser.png';

const UpdateFeed = forwardRef(({
  currentActiveUser,
  selectedfeed,
  topicDisplay,
  bgEffect,
  removeBGEffect,
  image
},props, ref) => {
  const {darkBG} = ref || {}
  const [allPosts, setAllPosts] = useState(null);
  const currentUser = props.currentActiveUser;

  // Fetches for all posts created to update all feeds
  async function updateMainFeed() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userSearched = urlParams.get("topicFeed");

    console.log("updatedfeed")

    if (!queryString) {
      // Updating the home feed
      const response = await fetch(`/update`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Couldnt update the feed! ${response.status}`);
      }

      const allPosts = await response.json();
      setAllPosts(allPosts.reversedPosts);
    } else {
      // Updating custom community feeds
      const response = await fetch(`/loadTopicFeed?topicFeed=${userSearched}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Couldnt update the feed! ${response.status}`);
      }

      const allPosts = await response.json();
      setAllPosts(allPosts.reversedPosts);
    }
  }

  const likeBtn = useRef([]);

  // Sound Effects for liking and commenting on posts
  let likeSoundEffect = new Audio('/src/assets/audio/likeSound.mp3')
  likeSoundEffect.volume = 0.4

  // Post liking system
  async function addLike(postID, currentPostIndex) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userSearched = urlParams.get("topicFeed");


    if (!queryString) {
      // If the like is being made on the users home feed
      const response = await fetch(`/addLike?feed=mainFeed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ postID: postID, loggedInUser: currentActiveUser }),
      });

      // Check if the like was successfully added (optional)
      if (response.ok) {
        likeSoundEffect.play()
        likeBtn.current[currentPostIndex].style.color = 'red'
        await updateMainFeed();
      } else {
        console.error("error adding like");
      }

    } else {

      // If the like is being made on another users profile page
      const response = await fetch(`/addLike?feed=${userSearched}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ postID: postID, loggedInUser: currentActiveUser }),
      });

      // Check if the like was successfully added (optional)
      if (response.ok) {
        likeSoundEffect.play()
        likeBtn.current[currentPostIndex].style.color = 'red'
        await updateMainFeed();
      } else {
        console.error("error adding like");
      }
    }
  }

  // Checks and shows if a user is already liking a post or not
  // all dependent on when the feed gets updated
  function checkCurrentlyLiked() {
    allPosts?.map((post, key) => {
      /* This checks to find if the post.likes array contains the current user logged in.
        If it is found then the visual heart will appear red.
       */
      if (post.likes.find(like => like.dynamicUser === currentActiveUser)) {
        likeBtn.current[key].style.color = "red";
      } else {
        likeBtn.current[key].style.color = "white";
      }

    });
  }


  // ran on component mount. Dependent on the the allPosts array
  useEffect(() => {
    checkCurrentlyLiked();
  }, [allPosts, currentUser]);

  // ran on component mount
  useEffect(() => {
    updateMainFeed();

  }, []);


  const currentDate = new Date();

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

  
  return (
    <>
      {/* Mapping each post in reverse (newest first) */}
      {/* post.poster is the author of the post */}
      {/* {showTopic()} */}
      {allPosts ? (
        <>
          {allPosts?.length > 0 ? (
            allPosts?.map((post, key) => {
              return (
                <>
                  <div key={post._id} className="userPost">
                    <main className="mainPost">
                      <div className="postAnalytics">
                        {/* flex container */}
                        <section className="userAction">
                          {/* checking for whos posting */}
                          <div className="postUserInformation">
                            <img
                              className="postProfilePic"
                              src={post.posterProfilePic || defaultProfilePic} // Fallback to default if no profile pic is found
                            />
                            <h2
                              className="poster"
                              onClick={() => navigateToProfile(post.poster)}
                            >
                              {post.poster}
                            </h2>
                          </div>

                          {showPostDate(post.postCreationDate)}
                        </section>
                        <p className="postCaption">{post.subject}</p>
                      </div>

                      {post.image ? (
                        <img id="postIMG" src={post.image} alt="Postimage" />
                      ) : (
                        <div style={{ display: "none" }}></div> // Optional: add a placeholder or leave it empty
                      )}

                      <h2 className="postBody">{post.body}</h2>
                      <br />
                    </main>
                    <nav className="postInteractionSection">
                      <div className="postLC">
                        <span
                          ref={(el) => (likeBtn.current[key] = el)}
                          className="likeBtn"
                          /* Passing in the index for each mapped post
                            into the addLike Function.
                           */
                          onClick={() => addLike(post._id, key)}
                        >
                          <i className="fa-solid fa-heart"></i>
                          <span >
                            {" "}
                            {post.likes.length}
                          </span>
                        </span>

                      </div>

                      <CommentMoodle
                          postSubject={post.subject}
                          postBody={post.body}
                          poster={post.poster}
                          postCreationDate={post.postCreationDate}
                          postID={post._id}
                          keyOfPost={key}
                          postLikesCount={post.likes.length}
                          postComments={post.comments}
                          image={post.image}
                          posterProfilePic={post.posterProfilePic}
                          showPostDate={showPostDate}
                          currentActiveUser={currentActiveUser}

                          // for updating the feed after a comment is made
                          updateMainFeed={updateMainFeed}
                      />
                      <ShowLikes
                        post={post}
                        bgEffect={bgEffect}
                        removeBGEffect={removeBGEffect}/>

                    </nav>
                  </div>
                </>
              );
            })
          ) : (
            <div className="noPostsMessage">
              <h2>No posts available</h2>
              <p>Be the first to share something!</p>
            </div>
          )}
        </>
      ) : (
        <div className="noPostsMessage">
          <div className=" loader "></div>
        </div>
      )}

    <span ref={darkBG} id="darkBG" onClick={()=> {removeBGEffect()}}></span>


    </>
  );
})


export default UpdateFeed;