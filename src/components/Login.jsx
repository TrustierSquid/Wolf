import { useEffect, useState, useRef } from "react";
import logo from "/src/assets/wolfLogo.png";

export default function Login() {
  const username = useRef(null);
  const password = useRef(null);
  const [loginErrorMessage, setLoginErrorMessage] = useState('')

  async function signIn() {
    if (username.current.value === "" || password.current.value === "") {
      setLoginErrorMessage("A username and password are needed to login or signup")
    } else {
      const response = await fetch("/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.current.value,
          password: password.current.value,
        }),
      });

      // if anything went wrong, it will remain on login page
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.err);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      
      password.current.value = ''
      username.current.value = ''
      setLoginErrorMessage('Invalid username or password')
      
      if (response.redirected) {
        window.location.href = response.url;
        // window.location.href = 'home.html';
      } else {
        password.current.value = ''
        username.current.value = ''
        return response.json()
      }
     // waiting on success message from server
      // if (successMessage.success == true) window.location.href = "home.html";
    }
  }

  async function createUser() {
    if (
      username.current.value === "" ||
      password.current.value === "" ||
      password.current.value.length <= 5
    ) {
      setLoginErrorMessage('A valid username and password are needed to login or signup')
    } else {
      
      // sending form data over to backend
      const response = await fetch("/users/add", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.current.value,
          password: password.current.value,
        }),
      });

      // if fails on frontend
      if (!response.ok) {
        const errorData = await response.json();
        loginErrorMessage.current.innerText = errorData.taken;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      password.current.value = "";
      username.current.value = "";
      setLoginErrorMessage("someone is already here with that username")
      
      if (response.redirected) {
        window.location.href = response.url;
        // window.location.href = 'user.html';

      } else {
        password.current.value = "";
        username.current.value = "";
        console.log("not redirected")
        return response.json()
      }

      
    }

  }

  // "/src/img/wolfLogo.png"
  return (
    <>
      <main id="loginContainer">
        <section id="title">
          <img src={logo} alt="" />
          <h1>WOLF</h1>
        </section>
        <form id="inputField">
          {/* for people demoing the app */}
          <p>
            For recruiters demoing Wolf: <br></br>USER: DemoUser <br></br> PASS: lovetocode
          </p>
          <div>
            <h5>USERNAME</h5>
            <input ref={username} type="text" placeholder="Enter your username"/>
          </div>
          <div>
            <h5>PASSWORD</h5>
            <input ref={password} type="password" placeholder="Enter your password"/>
          </div>
        </form>
        <div id="extraInfo">
          
          {/* error message */}
          <span>{loginErrorMessage}</span>
        </div>
        <div id="loginBtns">
          <button className="signUpBtn" onClick={() => createUser()}>
            Sign Up <i className="fa-solid fa-user-plus"></i>
          </button>
          <button className="signUpBtn" onClick={() => signIn()}>
            Log in <i className="fa-solid fa-right-to-bracket"></i>
          </button>
        </div>
      </main>
    </>
  );
}
