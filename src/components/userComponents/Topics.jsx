
import { useState, useEffect, useRef } from "react"

export default function Topics(){
   const [topicCounter, setTopicCounter] = useState(null)
   const [topic, setTopic] = useState([])
   const topicRefs = useRef({})
   const plusIcon = useRef(null)
   const checkIcon = useRef(null)

   useEffect(()=> {
      async function getTopic(){
         // grabbing topics to display on the topic select screen
         const response = await fetch('/api/topics', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            }
         })
         const data = await response.json()
         setTopic(data.topics)
      }

      getTopic()
   }, [])

   // the value is the topic the user selected.
   // refs is an object that keeps track of all the topic buttons on the page
   let addedTopics = 0
   function recordTopic(topicElementValue, refs) {
      
      // post the data that the user selected
      let stageTopics = async (topic)=> {
         const response = await fetch('/users/topics', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({topic: topic})
         })


      }
      
      // remove the selected topic from the server
      let removeStagedTopics = async (topic)=> {
         const response = await fetch('/users/topics', {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({topic: topic})
         })

         addedTopics--
      }

      
      /* STYLING FOR THE BUTTONS ON CLICK */
      
      refs.classList.toggle('selected')
      // if the "selected" class in not appended to the element, the innerHTML will remain
      if (!refs.classList.contains('selected')) {
         refs.innerHTML = `${topicElementValue} +`
         removeStagedTopics(topicElementValue)
      }

      
      
      // if the "selected" class is appended to the element, the innerHTML will be a check mark
      if (refs.innerText.includes('+') && refs.classList.contains('selected')) {
         stageTopics(topicElementValue)
         refs.innerHTML = `${topicElementValue} <i class="fa-solid fa-circle-check"></i>`
      }

      console.log(topicElementValue)

   }

   function reDirectToHome(){
      window.location.href = 'home.html'
   }

   /* async function finalizeTopics(){
      const response = await fetch('/api/topics/finalize', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({})
      })
   } */
   
   return (
      <>
         <main id="topics">
            <h1>Select what <span>topics</span> interest you.</h1>
            <p id="topicCounter">0/4</p>
            <div id="topicSelect">
               {topic.map(topic => {
                  return (
                     <>
                        <button 
                           key={topic.id} ref={element => topicRefs.current[topic.id] = element} 
                           onClick={()=> recordTopic(topic.name, topicRefs.current[topic.id])}>{topic.name} +  
                            </button>
                     </>
                  )
               })}
            </div>
            <br />
            <button id="continuteBtn" onClick={()=> reDirectToHome()}>Continute</button>
         </main>
      </>
   )
}
