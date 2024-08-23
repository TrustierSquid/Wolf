import { useEffect, useState } from "react";

export default function UpdateFeed() {
  const [allPosts, setAllPosts] = useState([]);

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
      console.table(allPosts);

      
    }
    
    update();

   }, []);

  //  setting the background if the post is made by a developer
   const developerStyle = {
    background: 'linear-gradient(90deg, rgba(63,68,251,1) 0%, rgba(146,85,255,1) 100%)'
  }

    // checks to see if the user that posted is an admin   
    function checkAdmin (poster) {
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

  return (
    <>
      {allPosts.map((post) => {
        return (
          <>
            <div className="userPost">
              <br />
              <main className="mainPost">
                <div className="postAnalytics">
                  {checkAdmin(post.poster)}
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
