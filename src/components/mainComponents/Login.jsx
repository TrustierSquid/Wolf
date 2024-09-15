import { useEffect, useState, useRef } from "react";
import logo from "/src/assets/wolfLogo.png";

export default function Login() {
  const username = useRef(null);
  const password = useRef(null);
  const [loginErrorMessage, setLoginErrorMessage] = useState('')


  async function signIn() {
    if (username.current.value === "" || password.current.value === "") {
      setLoginErrorMessage("A username and password are needed to login or signup.")
    } else {
      const response = await fetch(`/users/login`, {
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

      if (response.redirected) {
        window.location.href = '/home';
      } else {
        setLoginErrorMessage("Invalid username or password.")
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
      setLoginErrorMessage('A valid username and password are needed to login or signup.')
    } else {

      // sending form data over to backend
      const response = await fetch(`/users/add`, {
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
      setLoginErrorMessage("That username is already registered.")

      if (response.redirected) {
        // window.location.href = response.url;
        window.location.href = '/home';

      } else {
        password.current.value = "";
        username.current.value = "";
        console.log("not redirected")
        return response.json()
      }


    }

  }

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const signinCheck = urlParams.get("signUp");

  function determineSignUp(){
    // if on signUp version
    if (signinCheck) {
      return (
        <button className="signUpBtn" onClick={() => createUser()}>
          Sign Up <i className="fa-solid fa-user-plus"></i>
        </button>
      )
    } else {
      return (
        <button className="signUpBtn" onClick={() => signIn()}>
          Log In <i className="fa-solid fa-right-to-bracket"></i>
        </button>
      )
    }

  }



  // "/src/img/wolfLogo.png"
  return (
    <>
      <main id="loginContainer">
        <section id="title">
          <div className="titleSection">
            <img src={logo} alt="" />
            <h1>WOLF</h1>
          </div>
          <div className="titleSection">
            <h2>{signinCheck ? 'Sign up' : 'Login'}</h2>
          </div>
        </section>
        <form id="inputField">
          {/* for people demoing the app */}
          <div>
            <h3>USERNAME</h3>
            <input ref={username} type="text" placeholder="Enter your username"/>
          </div>
          <div>
            <h3>PASSWORD</h3>
            <input ref={password} type="password" placeholder="Enter your password"/>
          </div>
        </form>
        <section id="optionalDecision">
          <p>{signinCheck ? 'Have an Account?' : "Don't have an account?"}</p>
          <a href={signinCheck ? '/' : "/?signUp=true"} id="signUpLink">{signinCheck ? "Login" : "Sign Up"}</a>
        </section>
        <div id="extraInfo">
          {/* error message */}
          <span>{loginErrorMessage}</span>
        </div>
        <div id="loginBtns">
          {determineSignUp()}
        </div>
      </main>
    </>
  );
}
