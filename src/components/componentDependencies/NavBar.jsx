import { forwardRef, useRef } from "react"

const Navbar = forwardRef(({
   logo,
   username,
   followerCount,
   followingCount,
   dropdownFunction,
   logOutFunction,
   mobileNavFunction
}, ref) => {

   const {mobileNavBtn, profileDropdown} = ref || {};

   return(
      <>
         <nav id="nav">
               <div id="logoContainer">
                  <img id="logo" src={logo} alt="" />
                  <h1>WOLF</h1>
               </div>
               <div id="profileContainer" onClick={()=> dropdownFunction()}>
                  <h4>
                  <i className="fa-solid fa-user-gear"></i> {username} <i className="fa-solid fa-angle-down"></i></h4>
               </div>
               <button ref={mobileNavBtn} id="mobileNavBtn" onClick={()=> mobileNavFunction()}><i className="fa-solid fa-bars"></i></button>
            </nav>

            <section ref={profileDropdown} id="profileDropdown">
               <div className="profileSection">
                  <span id="userAnalyticsContainer">
                     <div id="dataPoint">
                        <h1>{followerCount}</h1>
                        <p>Followers</p>
                     </div>
                     <div id="dataPoint">
                        <h1>{followingCount}</h1>
                        <p>Following</p>
                     </div>
                  </span>
               </div>

               <div className="profileSection">
                  <h3>Hello, {username}!</h3>
               </div>
            </section>
      </>
   )
})

export default Navbar
