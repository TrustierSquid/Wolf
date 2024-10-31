import { useState, useEffect, useRef } from "react";
import Navbar from "../componentDependencies/NavBar";
import SideNavBar from "../componentDependencies/SideNavbar";

export default function Topics(props) {
  const [topics, setTopics] = useState([]);
  const cardBtnRef = useRef([])

  async function getTopics(){
    try {
      const response = await fetch('/api/topics', {
        method: 'GET',
        headers: {
          "Content-Type": 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json()



      setTopics(data.topics)

    } catch {
      console.log("Failed to get Topics")
    }
  }


  const [joinedTopicsState, setJoinedTopicsState] = useState([])
  const [membersCount, setMembersCount] = useState(null)

  // toggles weather or not you join a topic or leave one
  async function joinTopic(topicName, key){

    try {
      const response = await fetch(`/topicsAdd?loggedInUser=${props.loggedInUID}&topicToAdd=${topicName}&username=${props.username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Response was not okay!')
      } else {
        if (cardBtnRef.current[key].style.backgroundColor === 'green' && cardBtnRef.current[key].innerHTML === 'Joined!') {
          cardBtnRef.current[key].style.backgroundColor = '#ff3c3c'
          cardBtnRef.current[key].innerHTML = 'Join'
        } else {
          cardBtnRef.current[key].style.backgroundColor = 'green'
          cardBtnRef.current[key].innerHTML = 'Joined!'
        }
      }


    } catch {
      throw new Error("Could not send the join req")
    }

  }

  function checkCurrentlyJoin(){
    topics.map((topic, key)=> {
      if (props.userTopics?.includes(topic.name)) {
        cardBtnRef.current[key].style.backgroundColor = 'green'
        cardBtnRef.current[key].innerHTML = 'Joined!'
      } else {
        cardBtnRef.current[key].style.backgroundColor = '#ff3c3c'
        cardBtnRef.current[key].innerHTML = 'Join'
      }

    })
  }

  const [totalMembers, setTotalMembers] = useState(null)

  async function checkMembers() {
    let response = await fetch('/community/checkMembers', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({currentlyJoinedTopics: props.userTopics})
    })

    const memberData = await response.json()

    setTotalMembers(memberData)

  }






  useEffect(()=> {
    checkCurrentlyJoin()
    checkMembers()
  }, [topics, props.loggedInUID])



  useEffect(()=> {
    getTopics()
  }, [])


  console.log(totalMembers)


  // go to home page for user
  async function reDirectToHome() {
    window.location.href = `/home`;
  }

  return (
    <>
      <Navbar/>
      <main id="topicsContainer">

        <SideNavBar {...props.sidebarProps}/>
        {/* <p id="pageSubHeader">Browse and participate in these communities</p> */}

        <main>
          {/* <h1 id="pageHeader">Join a <span>community</span> that interests you.</h1> */}
          <div id="topicSelect">
            <section id="communityGridContainer">
              {topics?.sort((a, b)=> a.name.localeCompare(b.name)).map((topic, key)=> {

                return (
                  <>
                    <div key={topic.name} className="topicSelectionBtn">

                      <div className='topicHeader'>
                        <div className="communityTitle">
                          <img src={topic.img2} alt="" />
                          <h5>{topic.name}</h5>
                        </div>

                        <h4 style={{color: 'darkgrey'}}>

                          {totalMembers?.[key]?.community != null ? (
                            <h5 style={{ color: 'darkgrey' }}>{totalMembers[key].members.length} members</h5>
                        ) : (
                            <h5 style={{ color: 'darkgrey' }}>Loading members...</h5>
                        )}


                        </h4>

                        {/* <p className='memberCount'>0 Participants</p> */}
                      </div>

                      <p>{topic.fact1}</p>
                      <button
                      ref={(el) => (cardBtnRef.current[key] = el)}
                      className='communityJoinBtn'
                      onClick={()=> joinTopic(topic.name, key)}>
                        join
                      </button>

                    </div>
                  </>
                )
              })}
            </section>
          </div>
        </main>

      </main>
    </>
  );
}
