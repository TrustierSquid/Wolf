import { useEffect, useState, useRef } from "react";

export default function UpdateFeed(props) {
  const [allPosts, setAllPosts] = useState(null);
  const currentUser = props.currentActiveUser;
  // const darkBG = useRef(null)
  const commentInterface = useRef(null)

  // Fetches for all posts created to update all feeds
  async function updateMainFeed() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userSearched = urlParams.get("topicFeed");

    // if there is no query string fetching for a different feed, then the main feed will be returned
    if (!queryString) {
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

      /* localStorage.setItem('cachedPosts', JSON.stringify(allPosts.reversedPosts))

      const cachedPosts = localStorage.getItem('cachedPosts');
      if (cachedPosts) {
        setAllPosts(JSON.parse(cachedPosts));
      } else {
        fetchPosts();
      } */

    } else {
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

      /* localStorage.setItem('cachedPosts', JSON.stringify(allPosts.reversedPosts))

      const cachedPosts = localStorage.getItem('cachedPosts');
      if (cachedPosts) {
        setAllPosts(JSON.parse(cachedPosts));
      } else {
        fetchPosts();
      } */

    }


  }


  // poster is used to find the corresponding profile for the poster
  async function navigateToProfile(poster) {
    const response = await fetch(`/profileData/getID?poster=${poster}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    // The data returns the fetched user uid
    window.location.href = `/profile?user=${data.userUID}`;
    /* setTimeout(() => {
    }, 500); */
  }

  const [profilePictureFeed, setProfilePictureFeed] = useState(null)

  async function fetchProfilePicture(poster){
    try {
      let response = await fetch(`/profileData/getProfileImage/${poster}`)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      let imageData = await response.json()
      setProfilePictureFeed(imageData.profilePic)

    } catch (error) {
      console.error('Error fetching profile picture:', error);
      setProfilePictureFeed(null); // Set to null or a default image if desired
    }



  }

  // Checks to see if certain users are admin or special
  function checkAdmin(poster) {
    switch (poster) {
      case "Samuel":
        // fetchProfilePicture(poster)
        return (
          <>
            <h2 className="poster" onClick={() => navigateToProfile(poster)}>
              {/* <img id="feedProfilePic" src={profilePictureFeed} alt="" /> */}
              {poster}{" "}
              <p style={{ color: "turquoise" }}>Developer</p>
            </h2>
          </>
        );
      case "DemoUser":
        return (
          <>
            <h2 className="poster" onClick={() => navigateToProfile(poster)}>
              {poster}{" "}
              <span style={{ color: "#73ff00" }}>
                Recruiter <i className="fa-solid fa-clipboard"></i>
              </span>
            </h2>
          </>
        );
      case poster:
        return (
          <>
            <h2 className="poster" onClick={() => navigateToProfile(poster)}>
              {poster}{" "}
              <p style={{ color: "grey" }}>User</p>
            </h2>
          </>
        );
    }
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

  const [postSubject, setPostSubject] = useState(null)
  const [postBody, setPostBody] = useState(null)
  const [poster, setPoster] = useState(null)
  const [postCreationDate, setPostCreationDate] = useState(null)
  const [postID, setPostID] = useState(null)
  const [keyOfPost, setKeyOfPost] = useState(null)
  const [postLikesCount, setPostLikesCount] = useState(null)
  const [commentsCount, setCommentsCount] = useState(null)

  // for comments
  const [errorMessage, setErrorMessage] = useState('')
  const commentValue = useRef(null)
  const [postComments, setPostComments] = useState([])
  const [postImage, setPostImage] = useState(null)

  // Getting the information for the post selected when the interface appears.
  async function commentInterfaceAppear(postSubject, postBody, poster, creationDate, postID, keyOfPost,
     postLikesCount, postComments, image){

    setPostSubject(postSubject)
    setPostBody(postBody)
    setPoster(poster)
    setPostCreationDate(creationDate)
    setPostID(postID)
    setKeyOfPost(keyOfPost)
    setPostLikesCount(postLikesCount)
    setPostComments(postComments.reverse())
    setCommentsCount(postComments.length)
    setPostImage(image)

    setErrorMessage('')

    /*
      When invoked, the interface has these states relative to the post selected
      The opacity is changed and the pointer events are enabled
     */
    commentInterface.current.style.opacity = '1'
    commentInterface.current.style.pointerEvents = 'all'
    // props.bgEffect also gets envoked from the home component

  }

  function removeEffect(){
    commentInterface.current.style.opacity = '0'
    commentInterface.current.style.pointerEvents = 'none'
  }

  // for processing comments for posts
  async function addComment(comment, postID) {
    // Grabbing the query key and string
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userSearched = urlParams.get("topicFeed");

    if (comment === '') return
    commentValue.current.value = ''
    setErrorMessage('Adding Comment...')
    if (!queryString) {
      setTimeout( async () => {
        const response = await fetch(`/addPostComment?postID=${postID}&feed=mainFeed&commentFrom=${props.currentActiveUser}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({comment: comment})
        })

        if (!response.ok) {
          throw new Error("That didnt go through");
        }
        await updateMainFeed()
      }, 500);

      setErrorMessage('Added Comment!')
    } else {

      const response = await fetch(`/addPostComment?postID=${postID}&feed=${userSearched}&commentFrom=${props.currentActiveUser}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({comment: comment})
      })

      if (!response.ok) {
        throw new Error("That didnt go through");
      }

      setErrorMessage('Added Comment!')
      await updateMainFeed()
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

  return (
    <>
      {/* Mapping each post in reverse (newest first) */}
      {/* post.poster is the author of the post */}
      {/* {showTopic()} */}
      {(allPosts) ? (
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
                            {checkAdmin(post.poster)}
                            {showPostDate(post.postCreationDate)}
                          </section>
                          <p className="postCaption">
                            {post.subject}
                          </p>
                        </div>

                        {post.image ? (
                          <img id="postIMG" src={post.image} alt='Postimage' />
                        ) : (
                          <div style={{display: 'none'}}></div> // Optional: add a placeholder or leave it empty
                        )}

                        <h2 className="postBody">{post.body}</h2>
                        <br />
                      </main>
                      <nav className='postInteractionSection'>

                        <div className="postLC">
                          <span
                            ref={(el) => (likeBtn.current[key] = el)}
                            className="likeBtn"
                            onClick={() => addLike(post._id, key)}
                          >
                            <i className="fa-solid fa-heart"></i>
                            <span style={{ color: "white" }}> Like</span>
                          </span>
                          <span className="commentBtn"
                          onClick={()=> {commentInterfaceAppear(post.subject, post.body, post.poster, post.postcreationDate, post._id, key, post.likes.length, post.comments, post.image), props.bgEffect()}}>
                            <i className="fa-solid fa-comments"></i>{" "}
                            <span style={{ color: "white" }}
                            > Comment</span>
                          </span>
                        </div>

                        <div className="postDetails">
                          <span><i className="fa-regular fa-heart"></i> {post.likes.length}</span>
                          <span><i className="fa-regular fa-comment"></i> {post.comments.length}</span>
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
            <div className=' loader '>
            </div>
          </div>
        )}

      <div id="commentInterface" ref={commentInterface}>

        <h3 id="topDiv">
          <div id="fromWho">
            <h5>Post from:</h5>
            <h3 onClick={()=> navigateToProfile(poster)}>{poster}</h3>
          </div>
          <span id="exitCommentBtn" onClick={()=> {removeEffect(), props.removeBGEffect()}}><i className="fa-solid fa-x"></i></span>
        </h3>


        <section id="commentSection">
          <h2 id="exitBtnRow">{postSubject}</h2>
          {postImage ? (
            <img src={postImage} alt='Postimage' />
          ) : (
            <div style={{display: 'none'}}></div> // Optional: add a placeholder or leave it empty
          )}

          <p>{postBody}</p>

          <div id="indicators">
            <span id="commentSectionLike"><i className="fa-solid fa-heart"></i> {postLikesCount}</span>
            <span id="commentSectionComment"><i className="fa-solid fa-comments"></i> {commentsCount}</span>
          </div>
        </section>

        <section id="commentSection2">
          <form id="commentInput">
            <input ref={commentValue} required type="text" placeholder="Add a comment.."/>
            <button type="button" onClick={()=> addComment(commentValue.current.value, postID)}>Comment</button>
          </form>
          <br />
          <h4 style={{color: 'lime'}}>{errorMessage}</h4>
        </section>

        <article className='commentContainer'>
          {postComments?.length > 0 ? (
            postComments?.map((comment)=> {
              return (
                <>
                  <div className='comment'>
                    <h3 onClick={()=> navigateToProfile(comment.from)}>{comment.from} <span>{showPostDate(comment.timePosted)}</span></h3>
                    <p>{comment.comment}</p>
                  </div>
                </>
              )
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
