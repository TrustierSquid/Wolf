import logo from '/src/assets/wolfLogo.png'

// This is a component that Wolf bot will post information about a topic you select.
export default function WolfBotPost(props) {
   const botMessageStyle = {
      background: 'linear-gradient(90deg, rgba(251,63,63,1) 0%, rgba(255,85,120,1) 100%)'
   }


    return (
       <>
          <div className="userPost">
             <br />
             <main className="mainPost" >
               <div className="postAnalytics">
                  <h4 className="poster" style={{color: 'magenta'}}>
                     <i className="fa-solid fa-robot"></i> Wolf Bot 
                  </h4>
                  <i class="fa-solid fa-ellipsis"></i>
                <h2 className="postCaption">{props.topic} <span style={{color: 'magenta'}}>{props.icon}</span></h2>
                {/* <h2 className="postCaption">{`${props.topic} ${props.icon}`}</h2> */}
               </div>
                <h2 className="postBody">{`${props.fact}`}</h2>
             </main>
          </div>
       </>
    )
 }