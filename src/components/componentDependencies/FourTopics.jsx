import { useEffect, useState} from "react"


export default function FourTopics(props) {
   const userTopics = props.selectedTopics
   const [allTopics, setAllTopics] = useState([])

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
   
         console.log(data)
      }

      compareTopics()
   }, [])


   function topicSort() {
      // contains the first 4 topics
      const gridTopics = []
      
      for(let i = 0; i < 4; i++) {
         // pushes the first four of user selected topics
         gridTopics.push(userTopics)
         allTopics.map((topic)=> {
            if(gridTopics.includes(topic.name)) {
             console.log(gridTopics)  
            }
         })
         
      }
   }



   console.log(topicSort())

   return (
      <>
         <div id="introGrid">
            {/* {topicSort().map((selectedTopics, index) => {
               return (
                  <div key={index} className="gridItem">

                  </div>
               )
            })} */}
         </div>
      </>
   )
}