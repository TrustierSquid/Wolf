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
    }, 1000);

  }, []);




  // poster is used to find the corresponding profile for the poster
  function navigateToProfile(poster){
    // window.location.href = `/profile.html?user=${poster}`
    window.location.href = `/profile?user=${poster}`
  }



   // Checks to see if certain users are admin or special
  function checkAdmin (poster) {
    switch (poster) {
      case 'Samuel':
        return (
          <>
            <h2 className="poster" onClick={()=> navigateToProfile(poster)}>
              {poster} <span style={{color: '#00b3ff'}}>Developer <i className="fa-solid fa-code"></i></span>
            </h2>
          </>
        )
      case 'DemoUser':
        return (
          <>
            <h2 className="poster" onClick={()=> navigateToProfile(poster)}>
              {poster} <span style={{color: '#73ff00'}}>Recruiter <i className="fa-solid fa-clipboard"></i></span>
            </h2>
          </>
        )
      case poster:
        return (
          <>
            <h2 className="poster" onClick={()=> navigateToProfile(poster)}>
              {poster}  <span style={{color: 'grey'}}>User <i className="fa-solid fa-user"></i></span>
            </h2>
          </>
        )
    }
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

  const currentDate = new Date()

  function showPostDate(postCreationDate){
    // Get the difference in milliseconds
    const startDate = new Date(postCreationDate)
    const timeDifference = currentDate - startDate
    // console.log(postCreationDate)

    // Covert the difference from milliseconds to day and hours
    const millisecondsInOneDay = 24 * 60 * 60 * 1000;
    const millisecondsInOneHour = 60 * 60 * 1000
    const millisecondsInOneMinute = 60 * 1000;

    // Calculate days and hours
    const daysPassed = Math.floor(timeDifference / millisecondsInOneDay);
    const hoursPassed = Math.floor((timeDifference % millisecondsInOneDay) / millisecondsInOneHour);
    const minutesPassed = Math.floor((timeDifference % millisecondsInOneHour) / millisecondsInOneMinute);

    // console.log(`${daysPassed} days passed, ${hoursPassed} hours passed, ${minutesPassed} minutes passed`)

    if (minutesPassed === 0 && hoursPassed === 0 && daysPassed === 0) {
      return <h1 className="postData">Just now</h1>
    }

    if (minutesPassed > 0 && hoursPassed === 0 && daysPassed === 0) {
      return <h1 className="postData">{`${minutesPassed}m ago`}</h1>
    }

    if (hoursPassed > 0 || minutesPassed >= 60 && daysPassed === 0) {
      return <h1 className="postData">{`${hoursPassed}hr. ago`}</h1>
    }

    if (daysPassed > 0) {
      return <h1 className="postData">{`${daysPassed}d. ago`}</h1>
    }
    // return `${minutesPassed} minutes passed ${hoursPassed} hours passed ${daysPassed}`

  }

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
                      {checkAdmin(post.poster)}
                      {showPostDate(post.postCreationDate)}
                      {/* {handleFollowClick(post.poster, currentUser)} */}
                      {/* {handleFollowClick(post.poster, userFollowingList)} */}
                    </section>
                    <p className="postCaption"><i className="fa-solid fa-earth-americas"></i>{post.subject}</p>
                  </div>
                  <h2 className="postBody">{post.body}</h2>
                  <div className="postLC">
                    <span  ref={(el)=> (likeBtn.current[key] = el)} className="likeBtn" onClick={()=> addLike(post._id, key)}><i className="fa-solid fa-heart"></i><span style={{color: "grey"}}> {post.likes.length}</span></span>
                    <span  className="commentBtn" ><i className="fa-solid fa-comments"></i> <span style={{color: "grey"}}> Coming soon...</span></span>
                  </div>
                </main>
              </div>
            </>
          );


        })}
    </>
  );
}
