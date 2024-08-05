
import { useEffect, useState, useRef } from "react"
import logo from '/src/assets/wolfLogo.png'

export default function Login(){
   const username = useRef(null)
   const password = useRef(null)
   const loginErrorMessage = useRef(null)   


   async function signIn() {

      if(username.current.value === '' || password.current.value === '') {
         loginErrorMessage.current.innerText = 'A username and password are needed to login or signup'
      } else {
         const response = await fetch('/users/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username.current.value, password: password.current.value})
         })
         
         // if anything went wrong, it will remain on login page
         if (!response.ok) {
            const errorData = await response.json()
            loginErrorMessage.current.innerText = errorData.err
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         // waiting on success message from server
         const successMessage = await response.json()
         if (successMessage.success == true) window.location.href = 'home.html'
         

      }
      
      
   }



   async function createUser() {


      if (username.current.value === '' || password.current.value === '' || password.current.value.length <= 5) {
         loginErrorMessage.current.innerText = 'A valid username and password are needed to login or signup'
      } else {
         
         const response = await fetch('/users/add', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username.current.value, password: password.current.value})
         })
   
         if (!response.ok) {
            const errorData = await response.json()
            loginErrorMessage.current.innerText = errorData.taken
            throw new Error(`HTTP error! status: ${response.status}`);
            loginErrorMessage.current.innerText = data.taken
         }

         // waiting on success message from server
         const successMessage = await response.json()
         if (successMessage.success == true) window.location.href = 'user.html'
   
         username.current.value = ''
         password.current.value = ''
         console.log(data)
      }
      
      
   }
   

   // "/src/img/wolfLogo.png"
   return (
      <>
         <main id="container">
            <div id="loginContainer">
               <section id="title">
                  <img src={logo} alt="" />
                  <h1>WOLF</h1>
               </section>
               <form id="inputField">
                  <input ref={username} type="text" placeholder="USERNAME"/>
                  <input ref={password} type="password" placeholder="PASSWORD"/>
                  <a href="user.html">Forgot Password?</a>
                  <p>USER: User123, PASS: 12345</p>
                  <p ref={loginErrorMessage} style={{color: 'red'}}></p>
               </form>
               <div id="loginBtns">
                  <button className="signUpBtn" onClick={()=> createUser()}>Sign Up</button>
                  <button className="signUpBtn" onClick={()=> signIn()}>Log in</button>
               </div>
            </div>
         </main>
      </>
   )
}