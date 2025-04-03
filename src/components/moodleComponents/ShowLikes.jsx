import { useRef } from "react";
// Moodle for this feature will be inside this component

export default function ShowLikes(props) {
   // Moddle reference for the likes moodle
   let moodle = useRef(null)

   // Helper function to open Moodle
   function openMoodle() {
      props.bgEffect()
      moodle.current.style.opacity = "1";
      moodle.current.style.pointerEvents = "all";
   }

   function closeMoodle() {
      moodle.current.style.opacity = "0";
      moodle.current.style.pointerEvents = "none";
   }



  return (
    <>
      {props.post.likes.length > 0 ? (
        <>
          {/* Grabs the first 4 users */}
          <div className="showFirstFour">
            <p className="likedByText" onClick={()=> openMoodle()}>
              Liked By
              <span className="showAllLikes">
                {props.post.likes.map((like) => {
                  return <div>{like.dynamicUser}</div>;
                })}
              </span>
            </p>

            {
              // Selects the first four likes of o post and displays them
              props.post.likes.slice(0, 4).map((like) => {
                return (
                  <>
                    <span className="tooltip">
                      <img
                        onClick={() =>
                          (window.location.href = `/profile?user=${like.dynamicUID}`)
                        }
                        className="firstFourImg"
                        src={like.dynamicProfilePic || defaultProfilePic}
                        alt="dsa"
                      />
                      <span className="tooltiptext">{like.dynamicUser}</span>
                    </span>
                  </>
                );
              })
            }
          </div>

         <article className="universalMoodle" ref={moodle}>
           <section className="firstSection">
            <h2>Who Liked This Post</h2>
            <button className="closeMoodleBtn" onClick={()=> {props.removeBGEffect(), closeMoodle();}}><i className="fa-solid fa-x"></i></button>
           </section>

            {/* Lists of every person that liked this post */}
           <section className="secondSection">
            {
               props.post.likes.map((like)=> {
                  return (
                     <div key={like.dynamicUID} className="likeEntry" onClick={() => (window.location.href = `/profile?user=${like.dynamicUID}`)}>
                        <span className="tooltip">
                           <img
                              className="moodleImg"
                              src={like.dynamicProfilePic || defaultProfilePic}
                              alt="profile"
                           />
                           <span className="tooltiptext">{like.dynamicUser}</span>
                        </span>
                        <span className="nameOfUser">{like.dynamicUser}</span>
                     </div>
                  )
               })
            }
           </section>

         </article>

        </>
      ) : (
        <span>No likes yet</span>
      )}
    </>
  );
}
