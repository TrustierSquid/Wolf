import { useEffect, useState, useRef } from "react";

export default function UpdateFeed(props) {
  const [allPosts, setAllPosts] = useState([]);

  const currentUser = props.currentActiveUser

  // Fetches for all posts created to update feed
  useEffect(() => {

    async function updateMainFeed() {
      const response = await fetch("/update", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Couldnt update the feed! ${response.status}`)
      }

      const allPosts = await response.json();
      setAllPosts(allPosts.reversedPosts);

      // props.grippedFeed is a array that will dynamically change the feed that user can see.
      // props.grippedTopic is a value that will be used as a dependency for the userFeed
    }

    setInterval(() => {
      updateMainFeed();
    }, 100);

  }, []);


  // checks for the loggedin users following list
  useEffect(()=> {
    async function getFollowing() {
      const response = await fetch('/checkUser/following', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const followingList = await response.json()
      setUserFollowingList(followingList)
    }

    getFollowing()
  }, [])

   // Checks to see if certain users are admin or special
  function checkAdmin (poster, key) {
    switch (poster) {
      case 'Samuel':
        return (
          <>
            <h2 className="poster">
              {poster} <span style={{color: '#00b3ff'}}>Developer <i className="fa-solid fa-code"></i></span>
            </h2>
          </>
        )
      case 'DemoUser':
        return (
          <>
            <h2 className="poster">
              {poster} <span style={{color: '#73ff00'}}>Recruiter <i className="fa-solid fa-clipboard"></i></span>
            </h2>
          </>
        )
      case poster:
        return (
          <>
            <h2 className="poster" >
              {poster}  <span style={{color: 'orange'}}>User <i className="fa-solid fa-user"></i></span>
            </h2>
          </>
        )
    }
  }


  const [userFollowingList, setUserFollowingList] = useState([])


  const handleFollowClick = (poster, followList)=> {
    if (poster === currentUser) return

    //  If the current user is following the followee
    if(!userFollowingList.includes(poster)) {
      return <button className="followBtn" onClick={(element)=> {followUser(poster, currentUser, element)}}>Follow</button>
    }

    return <button className="followBtn" onClick={(element)=> {unFollowUser(poster, currentUser, element)}}>Unfollow</button>

  }


  // currrent user is the userthat is currently logged in
  async function followUser(postAuthor, currentUser, element){
    element.target.innerHTML = 'Followed!'
    const response = await fetch('/checkUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({followee: postAuthor, loggedInUser: currentUser})
    })


  }

  async function unFollowUser(postAuthor, currentUser, element) {
    element.target.innerHTML = 'Unfollowed!'
    const response = await fetch('/pullUser', {
      method: 'POST',
      headers : {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({followee: postAuthor, loggedInUser: currentUser})

    })
  }


  const likeBtn = useRef([])


  async function addLike(postID, currentPostIndex) {

    const response = await fetch('/addLike', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({postID: postID, loggedInUser: currentUser})
    })

    const data = await response.json()

  }

  // 3332 dads rooom num

  // Checks and shows if a user is already liking a post or not
  function checkCurrentlyLiked(){
    allPosts.map((post, key)=> {
      if(post.likes.includes(currentUser)) {
        likeBtn.current[key].style.color = 'red'
      } else {
        likeBtn.current[key].style.color = 'white'
      }
    })
  }

  setTimeout(() => {
    checkCurrentlyLiked()
  }, );

  return (
    <>
      {/* Mapping each post in reverse (newest first) */}
      {/* post.poster is the author of the post */}
      {/* {showTopic()} */}
      {allPosts.map((post, key) => {
        return (
            <>
              <div key={key} className="userPost">
                <br />
                <main className="mainPost">
                  <div className="postAnalytics">
                    <section className="userAction">
                      {/* checking for whos posting */}
                      {checkAdmin(post.poster, key)}
                      {/* {handleFollowClick(post.poster, currentUser)} */}
                      {/* {handleFollowClick(post.poster, userFollowingList)} */}
                    </section>
                    <p className="postCaption"><i class="fa-solid fa-earth-oceania"></i>{post.subject}</p>
                  </div>
                  <h2 className="postBody">{post.body}</h2>
                  <div className="postLC">
                    <span  ref={(el)=> (likeBtn.current[key] = el)} className="likeBtn" onClick={()=> addLike(post._id, key)}><i className="fa-solid fa-heart"></i><span style={{color: "grey"}}> {post.likes.length}</span></span>
                    <span  className="commentBtn" ><i className="fa-solid fa-comments"></i></span>
                  </div>
                </main>
              </div>
            </>
          );


        })}
    </>
  );
}
