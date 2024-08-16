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

  return (
    <>
      {allPosts.map((post) => {
        return (
          <>
            <div className="userPost">
              <br />
              <main className="mainPost">
                <div className="postAnalytics">
                  <h4 className="poster">
                    <i className="fa-solid fa-user"></i> {post.poster}
                  </h4>
                  <i class="fa-solid fa-ellipsis"></i>
                  <h2 className="postCaption">{post.subject}</h2>
                </div>
                <h2 className="postBody">{post.body}</h2>
                <div className="userTraction">
                  <button className="likeBtn">
                    Like <i className="fa-solid fa-thumbs-up"></i>
                  </button>
                </div>
              </main>
            </div>
          </>
        );
      })}
    </>
  );
}
