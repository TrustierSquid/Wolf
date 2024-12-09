import { useState, useEffect, useRef } from "react";
import Navbar from "../componentDependencies/NavBar";
import SideNavBar from "../componentDependencies/SideNavbar";
import logo from "/src/assets/wolfLogo.png";

export default function CommunitySelection(props){
   // The loggedIn users ID
   const userLoggedInUID = props.loggedInUID

   // The loggedIn joined communities
   const userLoggedInTopics = props.userTopics

   // dark overlay under moodles
   const darkBG = useRef()


   // moodle for modifying communities
   const modifyCommunityMoodleRef = useRef(null)

   // The preview ref for changing community images
   const changePictureRef = useRef(null)

   const [communityImagePreview, setCommunityImagePreview] = useState(null)
   const [showCreatedCommunities, setShowCreatedCommunities] = useState(false)
   const [totalMembers, setTotalMembers] = useState(null)
   const leaveCommunityBtn = useRef([])


   // list total members of a community
  async function retrieveCommunityInformation() {
    let response = await fetch('/community/retrieveCommunityInformation', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({currentlyJoinedTopics: userLoggedInTopics})
    })

    const memberData = await response.json()

   //  created array of all possible communities and the community information
    setTotalMembers(memberData)

  }

  useEffect(() => {
      retrieveCommunityInformation()
   }, [])


   // Leave a community
   async function leaveCommunity(communityToLeave, key){
      try {
         let response = await fetch(`/removeCommunity/${communityToLeave}/${userLoggedInUID}/${props.username}`, {
            headers: {
               'Content-Type': 'application/json'
            },
            method: 'PUT'
         })

         if (!response.ok) {
            throw new Error("Failed to remove topic from your list");
         }

         // updateData()
         leaveCommunityBtn.current[key].innerHTML = `<i class="fa-solid fa-check"></i>`
         leaveCommunityBtn.current[key].style.pointerEvents = 'none'


      } catch {
         console.log(`Couldnt remove user from ${communityToLeave}` )
      }

   }



   // NavigatioMethod could either be "toProfile" or just to pull data from this function
   const helperForGettingMemberInformation = async (member)=> {
      const response = await fetch(`/dynamic/${member}`)
      const data = await response.json()
   }

   // The current community information that will be staged for changing in the  modify community moodle
   const [modifyCommunityName, setModifyCommunityName] = useState(null)
   const [modifyCommunityMembers, setModifyCommunityMembers] = useState([])
   const [modifyCommunityDescription, setModifyCommunityDescription] = useState(null)
   const [modifyCommunityImage, setModidyCommunityImage] = useState({})


   const [communityOwner, setCommunityOwner] = useState(null)
   const [errorMessage, setErrorMessage] = useState('')


   const saveChangesBtn = useRef(null)

   // error Message ref
   const errorMessageRef = useRef(null)

   // Refs for the fields for the incoming changes to communities
   const newCommunityName = useRef(null)
   const newCommunityDescription = useRef(null)

   // confirmation moodle
   const confirmMoodleRef = useRef(null)
   const confirmInput = useRef(null)
   const confirmErrorMessage = useRef(null)


   // Modifying a community as an owner
   async function modifyCreatedCommunity(communityName, members, description, communityImage, owner) {
      setModifyCommunityName(communityName)
      setModifyCommunityMembers(members)
      setModifyCommunityDescription(description)
      setModidyCommunityImage(communityImage)
      setCommunityOwner(owner)
   }

   // Changing community information
   async function savingNewCommunityInformation(){
      let formData = new FormData()
      setErrorMessage('')

      if (!newCommunityName.current.value && !newCommunityDescription.current.value && !changePictureRef.current.files[0]) {
         console.log('There is nothing there')
         setErrorMessage(`You must modify ${modifyCommunityName} in order to save.`)
         return
      }

      if (newCommunityName.current.value === modifyCommunityName) {
         setErrorMessage('New name is the same as the previous name.')
         return
      }

      formData.append('communityName', newCommunityName.current.value)
      formData.append('communityDescription', newCommunityDescription.current.value)
      formData.append('communityImage', changePictureRef.current.files[0])

      errorMessageRef.current.style.color = 'lime'
      setErrorMessage('Changes Saved!')
      setTimeout(() => {
         window.location.reload()
      }, 1400);

      try {
         const response = await fetch(`/community/updateCommunityInformation/${communityOwner}/${modifyCommunityName}`, {
            method: 'PUT',
            body: formData
         })

      } catch (error){
         console.log(error)
      }

   }

   async function deleteCommunity(communityToDelete) {
      if (confirmInput.current.value === communityToDelete) {
         confirmErrorMessage.current.style.color = 'lime'
         setTimeout(() => {
            setErrorMessage('')
            window.location.reload()
         }, 1500);
         setErrorMessage(`Successfully Deleted ${modifyCommunityName}` )
         const response = await fetch(`/community/delete/${communityToDelete}`, {
            method: 'DELETE'
         })

      } else {
         confirmErrorMessage.current.style.color = 'crimson'
         setErrorMessage('Community name does not match.')
         setTimeout(() => {
            setErrorMessage('')
         }, 3000);
         return
      }

   }

   // helper function for opening and closing the modfiy moodle
   const modifyMoodleHelper = (action)=> {
      switch (action) {
         case 'openMoodle':
            darkBG.current.style.opacity = '1'
            darkBG.current.style.pointerEvents = 'all'
            modifyCommunityMoodleRef.current.style.opacity = '1'
            modifyCommunityMoodleRef.current.style.pointerEvents = 'all'
            document.body.style.overflow = 'hidden';
            break;
         case 'closeMoodle':
            modifyCommunityMoodleRef.current.style.opacity = '0'
            modifyCommunityMoodleRef.current.style.pointerEvents = 'none'
            darkBG.current.style.opacity = '0'
            darkBG.current.style.pointerEvents = 'none'
            document.body.style.overflow = 'auto';
            confirmMoodleRef.current.style.opacity = '0'
            confirmMoodleRef.current.style.pointerEvents = 'none'
            break
         case 'secondMoodle':
            confirmMoodleRef.current.style.opacity = '1'
            confirmMoodleRef.current.style.pointerEvents = 'all'
            modifyCommunityMoodleRef.current.style.opacity = '0'
            modifyCommunityMoodleRef.current.style.pointerEvents = 'none'
         default:
            break;
      }

   }



   // Helper function for rendering communities and communities that the logged in user owns
   const renderCommunities = ()=> {
      if (showCreatedCommunities) {
         const findOwner = totalMembers?.filter(community => community.owner === props.username)
         return findOwner.length > 0 ? (
            findOwner.map((community, key) => (
               <li key={key}>
                  <section className="topHalf">
                     <section className="communityInformation">
                        <img src={community.image ? community.image : 'src/assets/wolfLogo.png'} alt="" />
                        <h4>{community.name}</h4>

                     </section>

                     <section className="interactionBtns">
                        {/* Vist posts of community */}
                        <button className="viewCommunityPostsBtn" onClick={()=> window.location.href = `/home?topicFeed=${community.name + 'Feed'}`}>View Content</button>
                        <button className="communitySettingsBtn"
                        ref={(el) => (leaveCommunityBtn.current[key] = el)}
                         onClick={()=> {modifyCreatedCommunity(community.name, community.members, community.communityDescription, community.image, community.owner), modifyMoodleHelper('openMoodle')}}><i class="fa-solid fa-gear"></i></button>
                     </section>
                  </section>

                  <section className="botHalf">
                     <h4 style={{color: 'grey'}}>Community Created: {community.creationDate ? community.creationDate : '8/20/24'}</h4>
                     <h4 style={{color: 'lightgrey'}}>Owner: {community.owner}</h4>
                     <h4 style={{color: 'magenta'}}>Members: {community.members.length}</h4>
                     <br />
                     <h4>{community.communityDescription ? community.communityDescription : 'Launch Community'}</h4>
                  </section>
               </li>

            ))
         ) : (
            <div className="noPostsMessage">
               <h3>You do not own any communities. <a href="/topics" style={{color: 'crimson'}}>Create one!</a>  </h3>
            </div>
         )

      } else {
         // Tracker to see if the user has joined any communities at all
         let isJoinedCommunities = false
         const renderedCommunities = totalMembers?.map((community, key)=> {
            const isMember = community.members.includes(props.username)

            if (isMember) {
               isJoinedCommunities = true
               return (
                  <>
                     <li key={key}>
                        <section className="topHalf">
                           <section className="communityInformation">
                              <img src={community.image ? community.image : 'src/assets/wolfLogo.png'} alt="" />
                              <h4>{community.name}</h4>
                           </section>


                           <section className="interactionBtns">
                              {/* Vist posts of community */}
                              <button className="viewCommunityPostsBtn" onClick={()=> window.location.href = `/home?topicFeed=${community.name + 'Feed'}`}>View Content</button>
                              <button className="leaveCommunityBtn" ref={(el) => (leaveCommunityBtn.current[key] = el)} onClick={()=> leaveCommunity(community.name, key)}>Leave Community</button>
                           </section>
                        </section>

                        <section className="botHalf">
                           <h4 style={{color: 'grey'}}>Community Created: {community.creationDate ? community.creationDate : '8/20/24'}</h4>
                           <h4 style={{color: 'lightgrey'}}>Owner: {community.owner ? community.owner : 'WOLF Team'}</h4>
                           <h4 style={{color: 'magenta'}}>Members: {community.members.length}</h4>
                           <br />
                           <h4>
                              {community.communityDescription ? community.communityDescription : 'Launch Community'}
                           </h4>
                        </section>

                     </li>
                  </>
               )
            }

            return null
         })

         return isJoinedCommunities ? renderedCommunities : (
            <div className="noPostsMessage">
               <h3>You have not Joined any <a href="/topics" style={{color: 'crimson'}}>communities!</a>  </h3>
            </div>
         )

      }



   }


   return (
      <>
         <Navbar/>

         <div id="contentContainer">
            <span ref={darkBG} id="darkBG" onClick={()=> modifyMoodleHelper('closeMoodle')}></span>

            <div ref={modifyCommunityMoodleRef} id="modifyCommunityMoodle">
               <section id="moodleTitleBar">
                  <h2>Modify Community |<img src={modifyCommunityImage ? modifyCommunityImage : 'src/assets/wolfLogo.png' } alt="" /> {modifyCommunityName}</h2>
                  <button className="exitCommunityMoodle" onClick={()=> modifyMoodleHelper('closeMoodle')}><i className="fa-solid fa-x"></i></button>
               </section>
               <h3 id="showOwner">Owner: {communityOwner}</h3>

               <section id="modifyFieldCardContainer">
                  <form action="" id="modifyInformation">
                     <div className="changeCommunityImage">
                        <img src={communityImagePreview ? communityImagePreview : 'src/assets/wolfLogo.png'} alt="" />
                        <input accept="image/*" ref={changePictureRef} type="file" onChange={()=> {
                           // Processing the uploaded photo and getting a preview of what it looks like before the community is created
                           const file = changePictureRef.current.files[0]
                           if (file) {
                           const reader = new FileReader()
                           reader.onloadend = () => setCommunityImagePreview(reader.result)
                           reader.readAsDataURL(file)
                           }
                        }}/>
                     </div>

                     <div className='modifyCard'>
                        <label>Change Name</label>
                        <input type="text" ref={newCommunityName} placeholder={modifyCommunityName}/>
                     </div>

                     <div className='modifyCard'>
                        <label>Change Description</label>
                        <input maxLength={100} type="text" ref={newCommunityDescription} placeholder={modifyCommunityDescription}/>
                     </div>

                     <button id="saveChangesBtn"ref={saveChangesBtn} onClick={(e)=> {savingNewCommunityInformation(), e.preventDefault()}}>Save Changes</button>
                     <button id="deleteCommunityBtn" onClick={(e)=> {modifyMoodleHelper('secondMoodle'), e.preventDefault()}}>Delete Community</button>
                     <p className="errorMessage" ref={errorMessageRef}>{errorMessage}</p>
                  </form>

                  <section id="seeMembers">
                     <div id="membersCardTitle">
                        <h4>{modifyCommunityMembers.length} Members</h4>
                     </div>
                     <ul id="membersMap">
                        {
                           modifyCommunityMembers.map((member)=> {
                              return (
                                 <>
                                    <li className="memberCard">
                                       {
                                          member === props.username ? (
                                             <h4>{member} (owner)</h4>
                                          ) : (
                                             <h4>{member}</h4>
                                          )
                                       }
                                       <div className="memberActionBtns">
                                          <button className="viewProfileBtn" onClick={()=> {
                                             goToProfile
                                          }}>View Profile</button>

                                          {
                                             member === props.username ? (
                                                null
                                             ) : (
                                                <button className='removeBtn'>Remove</button>
                                             )
                                          }
                                       </div>

                                    </li>
                                 </>
                              )
                           })
                        }
                     </ul>
                  </section>
               </section>

            </div>

            {/* Confirmation moodle */}
            <div ref={confirmMoodleRef} id="confirmMoodle">
               <h3 className='confirmMoodleTitle'>
                  Are sure you want to delete {modifyCommunityName}? Enter the community name <span style={{color: 'red'}}>'{modifyCommunityName}'</span> to confirm.
                  </h3>
               <input type="text" id="deleteInputField" placeholder={modifyCommunityName} ref={confirmInput}/>
               <button id="deleteButton" onClick={()=> deleteCommunity(modifyCommunityName)}>Delete</button>
               <p className='errorMessage' ref={confirmErrorMessage}>{errorMessage}</p>
            </div>

            <SideNavBar {...props.sidebarItems}/>
            <main id="communityContainer">
               <div id="titleDiv">
                  <h1>My Communities </h1>
                  {/* On click, Show the communities that the user has created */}
                  <a onClick={()=> setShowCreatedCommunities(prevState => !prevState)}>

                     {
                        showCreatedCommunities ? 'Show all communities ' : 'Show my created comunities '
                     }

                     <i class="fa-solid fa-sort"></i>
                  </a>
               </div>

               <ul>
                  { // Conditional rendering indicate that the information is loading
                     (totalMembers) ? (
                        renderCommunities()
                     ) : (
                        <div className="noPostsMessage">
                           <div className=' loader '>
                           {/* Loading icon */}
                           </div>
                        </div>
                     )
                  }

               </ul>
            </main>
         </div>

      </>
   )
}