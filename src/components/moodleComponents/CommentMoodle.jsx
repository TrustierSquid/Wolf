import { useState, useRef } from "react";
import defaultProfilePic from "/src/assets/defaultUser.png";

export default function CommentMoodle(props, ref) {
  const commentInterface = useRef(null);
  const commentValue = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  // for processing and adding comments for posts
  async function addComment(comment, postID) {
    // Grabbing the query key and string
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userSearched = urlParams.get("topicFeed");

    if (comment === "") return;

    // Resetting the text box to an emtpy string
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
        await props.updateMainFeed();
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
      await props.updateMainFeed();
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
  }

  

  // Getting the information for the post selected when the interface appears.
  async function commentInterfaceAppear() {
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

  return (
    <>
      <span
        className="commentBtn"
        /* Capturing all of the post information
            and creating a moodle with post information
         */
        onClick={() => {
          commentInterfaceAppear(); // bgEffect();
        }}
      >
        <i style={{ color: "green" }} className="fa-solid fa-comments"></i>{" "}
        <span style={{ color: "white" }}> {props.postComments.length}</span>
      </span>

      <div id="commentInterface" ref={commentInterface}>
        <h3 id="topDiv">
          <div id="fromWho">
            <section>
              <img
                className="commentPosterProfilePic"
                src={
                  props.posterProfilePic // if the poster has a profile pic use it
                    ? props.posterProfilePic
                    : defaultProfilePic
                }
                alt=""
              />
              <h3 onClick={() => navigateToProfile(poster)}>{props.poster}</h3>
              <span style={{ color: "grey" }} className="commentTimePosted">
                {props.showPostDate(props.postCreationDate)}
              </span>
            </section>
          </div>
          <span
            id="exitCommentBtn"
            onClick={() => {
              removeEffect();
            }}
          >
            <i className="fa-solid fa-x"></i>
          </span>
        </h3>

        <section id="commentSection">
          <h2 id="exitBtnRow">{props.postSubject}</h2>
          {props.image ? (
            <img src={props.image} alt="Postimage" />
          ) : (
            <div style={{ display: "none" }}></div> // Optional: add a placeholder or leave it empty
          )}

          <p>{props.postBody}</p>

          <div id="indicators">
            <span id="commentSectionLike">
              <i className="fa-solid fa-heart"></i> {props.postLikesCount}
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
              onClick={() =>
                addComment(commentValue.current.value, props.postID)
              }
            >
              Comment
            </button>
          </form>
          <br />
          <h4 style={{ color: "lime" }}>{errorMessage}</h4>
        </section>
        {/* Setting the header plural */}
        <h2>
          {props.postComments.length > 1
            ? `${props.postComments.length} Comments`
            : `${props.postComments.length} Comment`}{" "}
        </h2>
        <article className="commentContainer">
          {props.postComments?.length > 0 ? (
            props.postComments?.map((comment) => {
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
                        <span
                          className="commentFrom"
                          onClick={() => navigateToProfile(comment.from)}
                        >
                          <h4>{comment.from}</h4>
                          <span className="commentTime">
                            {props.showPostDate(comment.timePosted)}
                          </span>
                        </span>
                      </section>

                      <p className="commentContent">{comment.comment}</p>
                    </div>

                    <button className="commentReplyBtn">Reply</button>
                  </div>
                </>
              );
            }).reverse()
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
