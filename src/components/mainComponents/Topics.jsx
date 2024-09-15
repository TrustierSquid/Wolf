import { useState, useEffect, useRef } from "react";
import Navbar from "../componentDependencies/NavBar";

export default function Topics(props) {
  const [topicCounter, setTopicCounter] = useState(null);
  const [topics, setTopics] = useState([]);
  const [topicsJoined, setTopicsJoined] = useState([])
  const topicRefs = useRef({});
  const plusIcon = useRef(null);
  const checkIcon = useRef(null);
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

  // toggles weather or not you join a topic or leave one
  async function joinTopic(topicName, key){

    try {
      const response = await fetch(`/topicsAdd?loggedInUser=${props.loggedInUID}&topicToAdd=${topicName}`, {
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
      if (props.joinedTopics.includes(topic.name)) {
        cardBtnRef.current[key].style.backgroundColor = 'green'
        cardBtnRef.current[key].innerHTML = 'Joined!'
      } else {
        cardBtnRef.current[key].style.backgroundColor = '#ff3c3c'
        cardBtnRef.current[key].innerHTML = 'Join'
      }

    })
  }

  useEffect(()=> {
    checkCurrentlyJoin()
  }, [topics, props.loggedInUID])

  useEffect(()=> {
    getTopics()
  }, [])



  // go to home page for user
  async function reDirectToHome() {
    window.location.href = `/home`;
  }

  return (
    <>
      <Navbar/>
      <main id="topics">
        <h1 id="pageHeader">Select a <span>topic</span> that interests you.</h1>
        <p id="pageSubHeader">Browse and participate in these communities</p>
        <div id="topicSelect">
          {topics?.map((topic, key)=> {

            return (
              <>
                <div key={topic.name} className="topicSelectionBtn">

                  <div className='topicHeader'>
                    <h3>{topic.name}</h3>
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
        </div>
        <br />
        {/* <button id="continuteBtn" onClick={() => reDirectToHome()}>
          Next <i className="fa-solid fa-right-long"></i>
        </button> */}
      </main>
    </>
  );
}
