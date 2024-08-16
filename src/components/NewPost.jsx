

export default function UserNewPost(props) {
  return (
    <>
        <div className="userPost">
            <br />
            <main className="mainPost">
                <div className="postAnalytics">
                    <h4 className="poster"><i className="fa-solid fa-user"></i> {props.whoPosted}</h4>
                </div>
                <h2 className="postCaption">{props.postSubject} {/* <p id="likeCounter" ref={likeCounterElement}> <i className="fa-solid fa-heart"></i> {posterTotalLikes}</p> */}</h2>
                <h2 className="postBody">{props.postBody}</h2>
                <div className="userTraction">
                    {/* <button className="followBtn" ref={followBtnElement} onClick={()=> {toggleFollow()}}>Follow <i className="fa-solid fa-user-plus"></i></button> */}
                    <button className="likeBtn" onClick={()=> {toggleLike()}}>Like <i className="fa-solid fa-thumbs-up"></i></button>
                </div>
            </main>
        </div>
    </>
  );
}
