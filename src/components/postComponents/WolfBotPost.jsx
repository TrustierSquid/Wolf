import logo from '/src/assets/wolfLogo.png'

// This is a component that Wolf bot will post information about a topic you select.
export default function WolfBotPost(props) {
    return (
       <>
          <div className="userPost">
             <div className="postAnalytics">
                <h1><img className="profilePicture" src={logo} alt="" />{"Wolf Bot"} posted</h1>
             </div>
             <br />
             <main className="mainPost">
                <h2 id="postCaption">{props.topic} {props.icon}</h2>
                <h2 id="postBody">{`${props.fact}`}</h2>
             </main>
          </div>
       </>
    )
 }