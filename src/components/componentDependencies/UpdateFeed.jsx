import { useEffect, useState, useRef } from "react";

export default function UpdateFeed(props) {
  const [allPosts, setAllPosts] = useState([]);
  const [sportsTopicPosts, setSportsTopicPosts] = useState([])
  const [cosmetologyTopicPosts, setcosmetologyTopicPosts] = useState([])
  const [foodTopicPosts, setFoodTopicPosts] = useState([])
  const [self_careTopicPosts, setSelf_careTopicPosts] = useState([])
  const [goal_settingTopicPosts, setGoal_settingTopicPosts] = useState([])
  const [techTopicPosts, setTechTopicPosts] = useState([])
  const [moviesTopicPosts, setMoviesTopicPosts] = useState([])
  const [TVTopicPosts, setTVTopicPosts] = useState([])
  const [readingTopicPosts, setReadingTopicPosts] = useState([])
  const [filmmakingTopicPosts, setFilmmakingTopicPosts] = useState([])
  const [DIYTopicPosts, setDIYTopicPosts] = useState([])
  const [datingTopicPosts, setDatingTopicPosts] = useState([])
  const [makeup_TutorialsTopicPosts, setMake_TutorialsTopicPosts] = useState([])
  const [programmingTopicPosts, setProgrammingTopicPosts] = useState([])
  const [life_hacksTopicPosts, setLife_hacksTopicPosts] = useState([])
  const [softwareTopicPosts, setSoftwareTopicPosts] = useState([])
  const [computerTopicPosts, setComputerTopicPosts] = useState([])

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
      showTopic(props.topicDisplay)

      /*
      setcosmetologyTopicPosts()
      setFoodTopicPosts()
      setSelf_careTopicPosts()
      setGoal_settingTopicPosts()
      setTechTopicPosts()
      setMoviesTopicPosts()
      setTVTopicPosts()
      setReadingTopicPosts()
      setFilmmakingTopicPosts()
      setDIYTopicPosts()
      setDatingTopicPosts()
      setMake_TutorialsTopicPosts()
      setProgrammingTopicPosts()
      setLife_hacksTopicPosts()
      setSoftwareTopicPosts()
      setComputerTopicPosts() */

    // props.grippedFeed is a array that will dynamically change the feed that user can see.
    // props.grippedTopic is a value that will be used as a dependency for the userFeed
  }
    updateMainFeed();
  }, []);

  async function updateSportsFeed(){
    const response = await fetch('/update/sports', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const sportsFeed = await response.json()
    setSportsTopicPosts(sportsFeed)
    showTopic(sportsTopicPosts)
  }

  async function updateCosmetologyFeed(){
    const response = await fetch('/update/cosmetology', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const cosmetologyFeed = await response.json()
    showTopic(cosmetologyFeed)
  }

  async function updateFoodFeed(){
    const response = await fetch('/update/food', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const foodFeed = await response.json()
    showTopic(foodFeed)
  }

  async function updateSelfCareFeed(){
    const response = await fetch('/update/selfcare', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const selfcareFeed = await response.json()
    showTopic(selfcareFeed)
  }

  async function updateGoalSettingFeed(){
    const response = await fetch('/update/goalsetting', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const goalsettingFeed = await response.json()
    showTopic(goalsettingFeed)
  }


  async function updateTechFeed(){
    const response = await fetch('/update/tech', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const techFeed = await response.json()
    showTopic(techFeed)
  }


  async function updateMoviesFeed(){
    const response = await fetch('/update/movies', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const moviesFeed = await response.json()
    showTopic(moviesFeed)
  }


  async function updateTvFeed(){
    const response = await fetch('/update/tv', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const TvFeed = await response.json()
    showTopic(TvFeed)
  }


  async function updateReadingFeed(){
    const response = await fetch('/update/reading', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const readingFeed = await response.json()
    showTopic(readingFeed)
  }


  async function updateFimmakingFeed(){
    const response = await fetch('/update/filmmaking', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const filmmakingFeed = await response.json()
    showTopic(filmmakingFeed)
  }


  async function updateDIYFeed(){
    const response = await fetch('/update/diy', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const diyFeed = await response.json()
    showTopic(diyFeed)
  }


  async function updateDatingFeed(){
    const response = await fetch('/update/dating', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const datingFeed = await response.json()
    showTopic(datingFeed)
  }


  async function updateMakeupFeed(){
    const response = await fetch('/update/makeup', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const makeupFeed = await response.json()
    showTopic(makeupFeed)
  }


  async function updateProgrammingFeed(){
    const response = await fetch('/update/programming', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const programmingFeed = await response.json()
    showTopic(programmingFeed)
  }


  async function updatelifeHackFeed(){
    const response = await fetch('/update/lifehacks', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const lifehacksFeed = await response.json()
    showTopic(lifehacksFeed)
  }


  async function updateSoftwareFeed(){
    const response = await fetch('/update/software', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const softwareFeed = await response.json()
    showTopic(softwareFeed)
  }

  async function updateComputerFeed(){
    const response = await fetch('/update/computer', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const computerFeed = await response.json()
    showTopic(computerFeed)
  }

  // updateSportsFeed()

  useEffect(()=> {
    const fetchFeeds = async ()=> {
      await updateSportsFeed()
      await updateCosmetologyFeed()
      await updateFoodFeed()
      await updateSelfCareFeed()
      await updateGoalSettingFeed()
      await updateTechFeed()
      await updateMoviesFeed()
      await updateTvFeed()
      await updateReadingFeed()
      await updateFimmakingFeed()
      await updateDIYFeed()
      await updateDatingFeed()
      await updateMakeupFeed()
      await updateProgrammingFeed()
      await updatelifeHackFeed()
      await updateSoftwareFeed()
      await updateComputerFeed()
    }

    fetchFeeds()
  }, [])




  function showTopic(selectedFeed){
    return (
      <>
        {allPosts.map((post, key) => {
          return (
            <>
              <div className="userPost">
                <br />
                <main className="mainPost">
                  <div className="postAnalytics">
                    <section className="userAction">
                      {/* checking for whos posting */}
                      {checkAdmin(post.poster, key)}
                      {/* {handleFollowClick(post.poster, currentUser)} */}
                      {/* {handleFollowClick(post.poster, userFollowingList)} */}
                    </section>
                    <p className="postCaption">{post.subject}</p>
                  </div>
                  <h2 className="postBody">{post.body}</h2>
                </main>
              </div>
            </>
          );
        })}
      </>
    )

  }


   // Checks to see if certain users are admin or special
  function checkAdmin (poster, key) {
    switch (poster) {
      case 'Samuel':
        return (
          <>
            <h2 className="poster">
              {poster} <span style={{color: '#00b3ff'}}>Developer <i class="fa-solid fa-code"></i></span>
            </h2>
          </>
        )
      case 'DemoUser':
        return (
          <>
            <h2 className="poster">
              {poster} <span style={{color: '#73ff00'}}>Recruiter <i class="fa-solid fa-clipboard"></i></span>
            </h2>
          </>
        )
      case poster:
        return (
          <>
            <h2 className="poster" >
              {poster}  <span style={{color: 'orange'}}> User</span>
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



  return (
    <>
      {/* Mapping each post in reverse (newest first) */}
      {/* post.poster is the author of the post */}
      {showTopic()}
    </>
  );
}

// {allPosts.map((post, key) => {
//   return (
//     <>
//       <div className="userPost">
//         <br />
//         <main className="mainPost">
//           <div className="postAnalytics">
//             <section className="userAction">
//               {/* checking for whos posting */}
//               {checkAdmin(post.poster, key)}
//               {/* {handleFollowClick(post.poster, currentUser)} */}
//               {handleFollowClick(post.poster, userFollowingList)}
//             </section>
//             <p className="postCaption">{post.subject}</p>
//           </div>
//           <h2 className="postBody">{post.body}</h2>
//         </main>
//       </div>
//     </>
//   );
// })}