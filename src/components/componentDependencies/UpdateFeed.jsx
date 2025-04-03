import { useEffect, useState, useRef, forwardRef } from "react";
import logo from "/src/assets/wolfLogo.png";
import defaultProfilePic from '/src/assets/defaultUser.png';
import ShowLikes from "../moodleComponents/ShowLikes";

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
  // const darkBG = useRef(null)
  const commentInterface = useRef(null);

  // Fetches for all posts created to update all feeds
  async function updateMainFeed() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userSearched = urlParams.get("topicFeed");

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

  const [firstFourArr, setFirstFourArr] = useState([])

  let setFour = (firstFourPeople)=> {
    getFirstFourLikes(firstFourPeople)
  }

  // Helper Function to plug in the manipulated data
  let getFirstFourLikes = async (firstFourPeople)=> {
    try {
      let stagingFour = await Promise.all(
        firstFourPeople.map(async (person)=> {
          try {
            // console.log(person)
            if (!person) {
              return

            } else {
              let response = await fetch(`/dynamic/${person}`, {
                method: "GET",
                headers: {
                  "Content-Type": 'application/json'
                }
              })

              if (!response.ok) {
                console.warn(`Couldnt find ${person} because they might not exist`)
                return
              }

              const data = await response.json();

              return data
            }


          } catch {
            console.log("Could not get the first four likes of this post")
          }
        })
      )

      // setFirstFourArr(stagingFour)
      console.log(stagingFour)
    } catch (error) {
      console.log("Error in fetching the first four likes:", error)
    }

  }

  // ran on component mount. Dependent on the the allPosts array
  useEffect(() => {
    checkCurrentlyLiked();
  }, [allPosts, currentUser]);

  // ran on component mount
  useEffect(() => {
    updateMainFeed();
  }, []);

  const [postSubject, setPostSubject] = useState(null);
  const [postBody, setPostBody] = useState(null);
  const [poster, setPoster] = useState(null);
  const [postCreationDate, setPostCreationDate] = useState(null);
  const [postID, setPostID] = useState(null);
  const [keyOfPost, setKeyOfPost] = useState(null);
  const [postLikesCount, setPostLikesCount] = useState(null);
  const [commentsCount, setCommentsCount] = useState(null);

  // for comments
  const [errorMessage, setErrorMessage] = useState("");
  const commentValue = useRef(null);
  const [postComments, setPostComments] = useState([]);
  const [postImage, setPostImage] = useState(null);
  const [posterProfilePicState, setPosterProfilePicState] = useState(null);

  // Getting the information for the post selected when the interface appears.
  async function commentInterfaceAppear(
    postSubject,
    postBody,
    poster,
    creationDate,
    postID,
    keyOfPost,
    postLikesCount,
    postComments,
    image,
    posterProfilePic
  ) {
    setPostSubject(postSubject);
    setPostBody(postBody);
    setPoster(poster);
    setPostCreationDate(creationDate);
    setPostID(postID);
    setKeyOfPost(keyOfPost);
    setPostLikesCount(postLikesCount);
    setPostComments(postComments.reverse());
    setCommentsCount(postComments.length);
    setPostImage(image);
    setPosterProfilePicState(posterProfilePic);

    setErrorMessage("");

    /*
      When invoked, the interface has these states relative to the post selected
      The opacity is changed and the pointer events are enabled
     */
    commentInterface.current.style.opacity = "1";
    commentInterface.current.style.pointerEvents = "all";
    // props.bgEffect also gets envoked from the home component
  }

  function removeEffect() {
    commentInterface.current.style.opacity = "0";
    commentInterface.current.style.pointerEvents = "none";
  }

  // for processing and adding comments for posts
  async function addComment(comment, postID) {
    // Grabbing the query key and string
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userSearched = urlParams.get("topicFeed");

    if (comment === "") return;
    commentValue.current.value = "";
    setErrorMessage("Adding Comment...");
    if (!queryString) {
      setTimeout(async () => {
        const response = await fetch(
          `/addPostComment?postID=${postID}&feed=mainFeed&commentFrom=${currentActiveUser}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ comment: comment }),
          }
        );

        if (!response.ok) {
          throw new Error("That didnt go through");
        }
        await updateMainFeed();
      }, 500);

      setErrorMessage("Added Comment!");
    } else {
      const response = await fetch(
        `/addPostComment?postID=${postID}&feed=${userSearched}&commentFrom=${props.currentActiveUser}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: comment }),
        }
      );

      if (!response.ok) {
        throw new Error("That didnt go through");
      }

      setErrorMessage("Added Comment!");
      await updateMainFeed();
    }
  }

  const currentDate = new Date();

  // Configuration for posts's time creation data
  function showPostDate(postCreationDate) {
    // Get the difference in milliseconds
    const startDate = new Date(postCreationDate);
    const timeDifference = currentDate - startDate;
    // console.log(postCreationDate)

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
                          {/* {checkAdmin(post.poster)} */}
                          <div className="postUserInformation">
                            <img
                              className="postProfilePic"
                              src={post.posterProfilePic || defaultProfilePic}
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
                        <span
                          className="commentBtn"
                          /* Capturing all of the post information
                            and creating a moodle with post information
                           */
                          onClick={() => {
                            commentInterfaceAppear(
                              post.subject,
                              post.body,
                              post.poster,
                              post.postcreationDate,
                              post._id,
                              key,
                              post.likes.length,
                              post.comments,
                              post.image,
                              post.posterProfilePic
                            ),
                              bgEffect();
                          }}
                        >
                          <i className="fa-solid fa-comments"></i>{" "}
                          <span style={{ color: "white" }}>
                            {" "}
                            {post.comments.length}
                          </span>
                        </span>
                      </div>

                      <ShowLikes post={post}/>

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

    <span ref={darkBG} id="darkBG" onClick={()=> {removeEffect(), removeBGEffect();}}></span>

      <div id="commentInterface" ref={commentInterface}>
        <h3 id="topDiv">
          <div id="fromWho">
            <section>
              <img
                className="commentPosterProfilePic"
                src={
                  posterProfilePicState
                    ? posterProfilePicState
                    : defaultProfilePic
                }
                alt=""
              />
              <h3 onClick={() => navigateToProfile(poster)}>{poster}</h3>
            </section>
          </div>
          <span
            id="exitCommentBtn"
            onClick={() => {
              removeEffect(), removeBGEffect();
            }}
          >
            <i className="fa-solid fa-x"></i>
          </span>
        </h3>

        <section id="commentSection">
          <h2 id="exitBtnRow">{postSubject}</h2>
          {postImage ? (
            <img src={postImage} alt="Postimage" />
          ) : (
            <div style={{ display: "none" }}></div> // Optional: add a placeholder or leave it empty
          )}

          <p>{postBody}</p>

          <div id="indicators">
            <span id="commentSectionLike">
              <i className="fa-solid fa-heart"></i> {postLikesCount}
            </span>
          </div>
        </section>

        <section id="commentSection2">
          <form id="commentInput">
            <input
              ref={commentValue}
              required
              type="text"
              placeholder="Add a comment.."
            />
            <button
              type="button"
              onClick={() => addComment(commentValue.current.value, postID)}
            >
              Comment
            </button>
          </form>
          <br />
          <h4 style={{ color: "lime" }}>{errorMessage}</h4>
        </section>
        {/* Setting the header plural */}
        <h2>
          {postComments.length > 1
            ? `${postComments.length} Comments`
            : `${postComments.length} Comment`}{" "}
        </h2>
        <article className="commentContainer">
          {postComments?.length > 0 ? (
            postComments?.map((comment) => {
              return (
                <>
                {/* Each individual comment */}
                  <div className="comment">

                    <div className="commentInsideContainer">
                      <section>
                        <img
                          className="commenterProfilePicImg"
                          src={
                            comment.commenterProfilePicImg
                              ? comment.commenterProfilePicImg
                              : defaultProfilePic
                          }
                          alt=""
                        />
                        <span className="commentFrom" onClick={() => navigateToProfile(comment.from)}>
                          <h4>{comment.from}</h4>
                          <span className="commentTime">
                            {showPostDate(comment.timePosted)}
                          </span>
                        </span>
                      </section>


                      <p className="commentContent">{comment.comment}</p>

                    </div>

                    <button className="commentReplyBtn">Reply</button>

                  </div>
                </>
              );
            })
          ) : (
            <div className="noPostsMessage">
              <h3>No comments available yet!</h3>
              <p>Be the first to leave a comment here! 🗣️</p>
            </div>
          )}
        </article>
      </div>
    </>
  );
})


export default UpdateFeed;