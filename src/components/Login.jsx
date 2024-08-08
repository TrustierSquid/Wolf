import { useEffect, useState, useRef } from "react";
import logo from "/src/assets/wolfLogo.png";

export default function Login() {
  const username = useRef(null);
  const password = useRef(null);
  const loginErrorMessage = useRef(null);

  async function signIn() {
    if (username.current.value === "" || password.current.value === "") {
      loginErrorMessage.current.innerText =
        "A username and password are needed to login or signup";
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
        loginErrorMessage.current.innerText = errorData.err;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // waiting on success message from server
      // const successMessage = await response.json();
      // if (successMessage.success == true) window.location.href = "home.html";
    }
  }

  async function createUser() {
    if (
      username.current.value === "" ||
      password.current.value === "" ||
      password.current.value.length <= 5
    ) {
      console.log("A valid username and password are needed to login or signup")
    } else {
      
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

      if (!response.ok) {
        const errorData = await response.json();
        loginErrorMessage.current.innerText = errorData.taken;
        throw new Error(`HTTP error! status: ${response.status}`);
        loginErrorMessage.current.innerText = data.taken;
      }

      // waiting on success message from server
      // const successMessage = await response.json();
      const json = await response.json()
      console.log(json)
      window.location.href = "http://localhost:5173/user"
      
      username.current.value = "";
      password.current.value = "";
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
          <a href="user.html">Forgot Password?</a>
          <p>
            For Recruiters: <br></br>USER: User123 <br></br> PASS: 12345
          </p>
          <span ref={loginErrorMessage} style={{ color: "red" }}></span>
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
