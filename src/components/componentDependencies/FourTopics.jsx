import { useEffect, useState, useRef} from "react"


export default function FourTopics(props) {
   const userTopics = props.selectedTopics
   const [allTopics, setAllTopics] = useState([])
   const gridItem = useRef([])

   useEffect(()=> {
      async function compareTopics() {
         const response = await fetch('/api/topics', {
            method: "GET",
            headers: {
               'Content-Type': 'application/json'
            },
         })

         const data = await response.json()
         setAllTopics(data.topics)

      }


      compareTopics()
   }, [])


   function topicSort() {
      // contains the first 4 topics
      const gridTopics = userTopics.slice(0, 4)

      // Create a list of central topics with their names and images
      const centralTopics = allTopics.map((topic)=> ({
         topicName: topic.name,
         topicImg: topic.img1,
         topicFact: topic.fact1
      }))

      // Find the topics that are both in gridTopics and centralTopics
      const commonValues = centralTopics.filter(topic => gridTopics.includes(topic.topicName))
      return commonValues
   }


   return (
      <>
         {/* <div id="introGrid">
            <h1>4 Topic Facts</h1>
            {topicSort().map((topic, key)=> {
               const itemStyle = {
                  position: 'relative',
                  backgroundImage: `url(${topic.topicImg})`,
                  backgroundSize: 'cover', // Ensure the background image covers the entire item
                  backgroundPosition: 'center', // Center the image within the item
                  backgroundRepeat: 'no-repeat', // Prevent repeating of the image
                  overflow: 'hidden'
               }

               const overlayStyle = {
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  background: 'rgb(33, 32, 32, 0.8)',
                  zindex: '1'
               }


               const contentStyle = {
                  position: 'relative',
               }


               return(
                  <div className="gridItem"
                  // callback ref
                     ref={(el) => (gridItem.current[key] = el)}
                     // onClick={()=> {props.changeTopic(gridItem.current[key], topic.topicName)}}
                     style={itemStyle}
                     key={key}
                     >

                     <div style={overlayStyle}></div>
                     <div style={contentStyle}>
                        <h3>{topic.topicName}</h3>
                        <br />
                        <p>{topic.topicFact}</p>
                     </div>
                  </div>
               )
            })}
         </div> */}
      </>
   )
}