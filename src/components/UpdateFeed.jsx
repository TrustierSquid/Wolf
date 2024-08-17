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
      setAllPosts(allPosts.allPosts);
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
        case 'samuel':
          return (
            <>
                <h4 className="poster" style={{color: 'red'}}>
                <i className="fa-solid fa-user" style={{color: 'white'}}></i> {poster} (Developer)
                </h4>
            </>
          )
        case 'DemoUser':
          return (
            <>
                <h4 className="poster" style={{color: '#73ff00'}}>
                <i className="fa-solid fa-user" style={{color: 'white'}}></i> {poster} (Recruiter)
                </h4>
            </>
          )
        case poster:
          return (
            <>
                <h4 className="poster" style={{color: 'orange'}}>
                <i className="fa-solid fa-user" style={{color: 'white'}}></i> {poster} (User)
                </h4>
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
                  <i class="fa-solid fa-ellipsis"></i>
                  <h2 className="postCaption">{post.subject}</h2>
                </div>
                <h2 className="postBody">{post.body}</h2>
                <div className="userTraction">
                  {/* <button className="likeBtn">
                    Like <i className="fa-solid fa-thumbs-up"></i>
                  </button> */}
                </div>
              </main>
            </div>
          </>
        );
      })}
    </>
  );
}
