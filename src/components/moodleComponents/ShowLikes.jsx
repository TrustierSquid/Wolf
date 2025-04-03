// Moodle for this feature will be inside this component

export default function ShowLikes(props) {
  return (
    <>
      {props.post.likes.length > 0 ? (
        <>
          {/* Grabs the first 4 users */}
          <div className="showFirstFour">
            <p className="likedByText">
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
                      {/* <p className="tooltiptext">{like.dynamicUser}</p> */}
                      <span className="tooltiptext">{like.dynamicUser}</span>
                    </span>
                  </>
                );
              })
            }
          </div>
        </>
      ) : (
        <span>No likes yet</span>
      )}
    </>
  );
}
