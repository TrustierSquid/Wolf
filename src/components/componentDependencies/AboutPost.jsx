

// A post will apppear about the app details.
export default function AboutPost(props){
    return (
       <>
          <div className="userPost">
             <br />
             <main className="mainPost">
                <h2 id="postCaption">About <i className="fa-solid fa-book"></i></h2>
                <h2 id="postBody">App Version: {props.appVersion}</h2>
             </main>
          </div>
       </>
    )
 }