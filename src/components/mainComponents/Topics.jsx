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
  }


  async function checkTopicsJoined(){
    const response = await fetch(`/topicsJoined?UUID=${props.loggedInUID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json()
    setTopicsJoined(data?.topics || [])
  }

  useEffect(()=> {
    getTopics()
    console.log(topicsJoined)
  }, [topicsJoined])

  useEffect(()=> {
    if (props.loggedInUID) {
      checkTopicsJoined()
    }
  }, [props.loggedInUID])

  useEffect(()=> {
    checkTopicsJoined()
  }, [])


  useEffect(()=> {
    topics.forEach((topic, index)=> {
      if(topicsJoined.includes(topic.name)){
        const button = cardBtnRef.current[index]
        if(button){
          button.style.backgroundColor = 'green'
          button.innerHTML = 'joined!'
        }
      }
    })
  }, [topics, topicsJoined])





  // toggles weather or not you join a topic or leave one
  async function joinTopic(topicName){
    const response = await fetch(`/topicsAdd?loggedInUser=${props.loggedInUID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({topicToAdd: topicName}),
    })


    await getTopics()
    await checkTopicsJoined()



  }

  async function showJoined() {
    topics.map((topic, key)=> {
      if (topicsJoined?.includes(topic.name)) {
        cardBtnRef.current[key].style.backgroundColor = 'green'
      }
    })
  }

  showJoined()


  // go to home page for user
  async function reDirectToHome() {
    window.location.href = `/home`;
  }

  return (
    <>
      <Navbar/>
      <main id="topics">
        <h1 id="pageHeader">Select <span>topics</span> that interest you. <i className="fa-solid fa-users"></i></h1>
        <p id="pageSubHeader">Browse and participate in these communities</p>
        <div id="topicSelect">
          {topics?.map((topic, key)=> {
            return (
              <>
                <div key={topic.name} className="topicSelectionBtn">

                  <div className='topicHeader'>
                    <h3>{topic.name}</h3>
                    <p className='memberCount'>0 Participants</p>
                  </div>

                  <p>{topic.fact1}</p>
                  <button ref={(el) => (cardBtnRef.current[key] = el)} className="communityJoinBtn" onClick={()=> joinTopic(topic.name)}>{topicsJoined.includes(topic.name) ? 'Joined!' : 'Join'}</button>

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
