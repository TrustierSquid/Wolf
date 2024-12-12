import { useEffect, useState, useRef } from "react";

export default function UpdateFeed(props) {
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

  async function addLike(postID, currentPostIndex) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userSearched = urlParams.get("topicFeed");

    if (!queryString) {
      const response = await fetch(`/addLike?feed=mainFeed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postID: postID, loggedInUser: currentUser }),
      });

      // Check if the like was successfully added (optional)
      if (response.ok) {
        // Immediately update the button style
        if (likeBtn.current[currentPostIndex].style.color === "red") {
          likeBtn.current[currentPostIndex].style.color = "white"; // Unlike
        } else {
          likeBtn.current[currentPostIndex].style.color = "red"; // Like
        }

        await updateMainFeed();
      } else {
        console.error("error adding like");
      }
    } else {
      const response = await fetch(`/addLike?feed=${userSearched}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postID: postID, loggedInUser: currentUser }),
      });

      // Check if the like was successfully added (optional)
      if (response.ok) {
        // Immediately update the button style
        if (likeBtn.current[currentPostIndex].style.color === "red") {
          likeBtn.current[currentPostIndex].style.color = "white"; // Unlike
        } else {
          likeBtn.current[currentPostIndex].style.color = "red"; // Like
        }

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
      if (post.likes.includes(currentUser)) {
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
  const [posterProfilePicState, setPosterProfilePicState] = useState(null)

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
    setPosterProfilePicState(posterProfilePic)


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


  // for processing comments for posts
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
          `/addPostComment?postID=${postID}&feed=mainFeed&commentFrom=${props.currentActiveUser}`,
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

  // Configuration for posts's creation data
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
                              src={post.posterProfilePic}
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
                          onClick={() => addLike(post._id, key)}
                        >
                          <i className="fa-solid fa-heart"></i>
                          <span style={{ color: "white" }}> {post.likes.length}</span>
                        </span>
                        <span
                          className="commentBtn"
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
                              props.bgEffect();
                          }}
                        >
                          <i className="fa-solid fa-comments"></i>{" "}
                          <span style={{ color: "white" }}> {post.comments.length}</span>
                        </span>
                      </div>


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

      <div id="commentInterface" ref={commentInterface}>
        <h3 id="topDiv">
          <div id="fromWho">
            <section>
              <img className='commentPosterProfilePic' src={posterProfilePicState ? posterProfilePicState : 'src/assets/defaultUser.jpg'} alt="" />
              <h3 onClick={() => navigateToProfile(poster)}>{poster}</h3>
            </section>
          </div>
          <span
            id="exitCommentBtn"
            onClick={() => {
              removeEffect(), props.removeBGEffect(commentInterface);
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
            <span id="commentSectionComment">
              <i className="fa-solid fa-comments"></i> {commentsCount}
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
        <h2>{postComments.length > 1 ? `${postComments.length} Comments` : `${postComments.length} Comment`} </h2>
        <article className="commentContainer">
          {postComments?.length > 0 ? (
            postComments?.map((comment) => {
              console.log(comment)
              return (
                <>
                  <div className="comment">
                    <section>
                      <img className="commenterProfilePicImg" src={comment.commenterProfilePicImg ? comment.commenterProfilePicImg : 'src/assets/defaultUser.jpg'} alt="" />
                      <h3 onClick={() => navigateToProfile(comment.from)}>
                        {comment.from}
                        <span className="commentTime">{showPostDate(comment.timePosted)}</span>
                      </h3>
                    </section>
                    <br />

                    <p>{comment.comment}</p>
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
}
