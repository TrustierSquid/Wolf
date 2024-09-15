import { useEffect, useState, useRef } from "react";

export default function UpdateFeed(props) {
  const [allPosts, setAllPosts] = useState([]);
  const currentUser = props.currentActiveUser;
  // const darkBG = useRef(null)
  const commentInterface = useRef(null)

  // Fetches for all posts created to update all feeds
  async function updateMainFeed() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userSearched = urlParams.get("topicFeed");
    console.log(`${userSearched}`)

    // if there is no query string fetching for a different feed, then the main feed will be returned
    if (!queryString) {
      const response = await fetch("/update", {
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
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    console.log(data)

    window.location.href = `/profile?user=${data.userUID}`;
    /* setTimeout(() => {
    }, 500); */
  }

  // Checks to see if certain users are admin or special
  function checkAdmin(poster) {
    switch (poster) {
      case "Samuel":
        return (
          <>
            <h2 className="poster" onClick={() => navigateToProfile(poster)}>
              {poster}{" "}
              <span style={{ color: "#00b3ff" }}>
                Developer <i className="fa-solid fa-code"></i>
              </span>
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
              <span style={{ color: "grey" }}>
                User <i className="fa-solid fa-user"></i>
              </span>
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

  // 3332 dads rooom num

  // Checks and shows if a user is already liking a post or not
  // all dependent on when the feed gets updated
  function checkCurrentlyLiked() {
    allPosts.map((post, key) => {
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

  async function commentInterfaceAppear(postSubject, postBody, poster, creationDate, postID, keyOfPost,
     postLikesCount, postComments, ){
    console.log("comment interface")

    setPostSubject(postSubject)
    setPostBody(postBody)
    setPoster(poster)
    setPostCreationDate(creationDate)
    setPostID(postID)
    setKeyOfPost(keyOfPost)
    setPostLikesCount(postLikesCount)
    setPostComments(postComments.reverse())
    setCommentsCount(postComments.length)


    // styling
    commentInterface.current.style.opacity = '1'
    commentInterface.current.style.pointerEvents = 'all'


  }

  function removeEffect(){
    commentInterface.current.style.opacity = '0'
    commentInterface.current.style.pointerEvents = 'none'
  }

  // for processing comments for posts
  async function addComment(comment, postID) {
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
          throw new Error("That shit didnt go through");
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
        throw new Error("That shit didnt go through");
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


    // Display time passed
    if (daysPassed >= 1) {
      return <h1 className="postData">{`${daysPassed}d ago`}</h1>;
    }

    if (hoursPassed > 0) {
      return <h1 className="postData">{`${hoursPassed}hr ago`}</h1>;
    }

    if (minutesPassed > 0) {
      return <h1 className="postData">{`${minutesPassed}m ago`}</h1>;
    }

    return <h1 className="postData">Just now</h1>;


  }

  return (
    <>
      {/* <span ref={darkBG} onClick={()=> dissappearEffect()} id="darkBG"></span> */}
      {/* Mapping each post in reverse (newest first) */}
      {/* post.poster is the author of the post */}
      {/* {showTopic()} */}
      {allPosts?.length > 0 ? (
        allPosts.map((post, key) => {
          return (
            <>
              <div key={key} className="userPost">
                <br />
                <main className="mainPost">
                  <div className="postAnalytics">
                    <section className="userAction">
                      {/* checking for whos posting */}
                      {checkAdmin(post.poster)}
                      {showPostDate(post.postCreationDate)}
                      {/* {handleFollowClick(post.poster, currentUser)} */}
                      {/* {handleFollowClick(post.poster, userFollowingList)} */}
                    </section>
                    <p className="postCaption">
                      <i className="fa-solid fa-bolt"></i>
                      {post.subject}
                    </p>
                  </div>
                  <h2 className="postBody">{post.body}</h2>
                  <div className="postLC">
                    <span
                      ref={(el) => (likeBtn.current[key] = el)}
                      className="likeBtn"
                      onClick={() => addLike(post._id, key)}
                    >
                      <i className="fa-solid fa-heart"></i>
                      <span style={{ color: "grey" }}> {post.likes.length}</span>
                    </span>
                    <span className="commentBtn"
                     onClick={()=> {commentInterfaceAppear(post.subject, post.body, post.poster, post.postcreationDate, post._id, key, post.likes.length, post.comments), props.bgEffect()}}>
                      <i className="fa-solid fa-comments"></i>{" "}
                      <span style={{ color: "grey" }}
                      > {post.comments.length}</span>
                    </span>

                  </div>
                </main>
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




      <div id="commentInterface" ref={commentInterface}>
        <section id="commentSection">
          <h2 id="exitBtnRow"> {postSubject} <span id="exitCommentBtn" onClick={()=> {removeEffect(), props.removeBGEffect()}}>Back <i className="fa-solid fa-arrow-right"></i></span></h2>
          <p>{postBody}</p>

          <div id="indicators">
            <span id="commentSectionLike"><i className="fa-solid fa-heart"></i> {postLikesCount}</span>
            <span id="commentSectionComment"><i className="fa-solid fa-comments"></i> {commentsCount}</span>
          </div>
        </section>

        <section id="commentSection2">
          <form id="commentInput">
            <input ref={commentValue} required type="text" placeholder="Add a comment.."/>
            <button type="button" onClick={()=> addComment(commentValue.current.value, postID, )}>Comment +</button>
          </form>
          <br />
          <h4 style={{color: 'lime'}}>{errorMessage}</h4>
          <article>
            {postComments?.map((comment)=> {
              return (
                <>
                  <div className='comment'>
                    <h3>{comment.from} <span>{showPostDate(comment.timePosted)}</span></h3>
                    <p>{comment.comment}</p>
                  </div>
                </>
              )
            })}
          </article>
        </section>

      </div>
    </>
  );
}
