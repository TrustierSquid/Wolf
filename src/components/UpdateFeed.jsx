import { useEffect, useState, useRef } from "react";

export default function UpdateFeed(props) {
  const [allPosts, setAllPosts] = useState([]);
  const currentUser = props.currentActiveUser

  // Fetches for all posts created to update feed
  useEffect(() => {
    async function update() {
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

      
    }
    
    update();

  }, []);

   // Checks to see if certain users are admin or special
  function checkAdmin (poster, key) {
    switch (poster) {
      case 'Samuel':
        return (
          <>
              <h2 className="poster">
                {poster}<span style={{color: 'red'}}>(Developer)</span>
              </h2>
          </>
        )
      case 'DemoUser':
        return (
          <>
              <h2 className="poster" style={{color: '#73ff00'}}>
              <i className="fa-solid fa-user" style={{color: 'white'}}></i> {poster} (Recruiter)
              
              </h2>
          </>
        )
      case poster:
        return (
          <>
              <h2 className="poster" >
                {poster} <span style={{color: 'orange'}}>(User)</span>
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
      return <button className="followBtn" onClick={(element)=> {followUser(poster, currentUser, element)}}>Follow +</button>
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
                    {handleFollowClick(post.poster, userFollowingList)}
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
  );
}
