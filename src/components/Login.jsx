
import { useEffect, useState, useRef } from "react"

export default function Login(){
   const username = useRef(null)
   const password = useRef(null)
   


   async function signIn() {
      const response = await fetch('/api/signin', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({username: username.current.value, password: password.current.value})
      })

      const data = await response.json()
      console.log(data)
   }



   async function createUser() {
      const response = await fetch('/api/signin/add', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({username: username.current.value, password: password.current.value})
      })

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json()
      console.log(data)
   }
   

   
   return (
      <>
         <main id="container">
            <div id="loginContainer">
               <section id="title">
                  <img src="/src/img/wolfLogo.png" alt="" />
                  <h1>WOLF</h1>
               </section>
               <form id="inputField">
                  <input ref={username} type="text" placeholder="USERNAME"/>
                  <input ref={password} type="password" placeholder="PASSWORD"/>
                  <a href="user.html">Forgot Password?</a>
                  <p>USER: User123, PASS: 12345</p>
               </form>
               <button id="signUpBtn" onClick={()=> createUser()}>Sign in</button>
            </div>
         </main>
      </>
   )
}