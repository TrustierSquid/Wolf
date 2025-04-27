import { useEffect, useState, useRef } from "react";
import logo from "/src/assets/wolfLogo.png";

export default function Login() {
  const username = useRef(null);
  const password = useRef(null);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const famousQuotes = [
    "Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world. - Albert Einstein",
    "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel. - Maya Angelou",
    "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do. - Steve Jobs",
    "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
    "Be yourself; everyone else is already taken. - Oscar Wilde",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
    "Don't cry because it's over, smile because it happened. - Dr. Seuss",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "All our dreams can come true if we have the courage to pursue them. - Walt Disney",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "In the middle of every difficulty lies opportunity. - Albert Einstein",
    "Happiness is not something ready-made. It comes from your own actions. - Dalai Lama",
    "Do what you can, with what you have, where you are. - Theodore Roosevelt",
    "Strive not to be a success, but rather to be of value. - Albert Einstein",
    "Act as if what you do makes a difference. It does. - William James",
    "I can't change the direction of the wind, but I can adjust my sails to always reach my destination. - Jimmy Dean",
    "The best way to predict your future is to create it. - Abraham Lincoln",
    "You miss 100% of the shots you don't take. - Wayne Gretzky",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
  ];

  // random value
  let randomQuote =
    famousQuotes[Math.floor(Math.random() * famousQuotes.length)];

  async function signIn() {
    if (username.current.value === "" || password.current.value === "") {
      setLoginErrorMessage("Enter a username and password.");
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

      password.current.value = "";
      username.current.value = "";

      if (response.redirected) {
        window.location.href = "/home";
      } else {
        setLoginErrorMessage("Invalid username or password.");
        password.current.value = "";
        username.current.value = "";
        return response.json();
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
      setLoginErrorMessage("Enter a username and password.");
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
      setLoginErrorMessage("That username is already registered.");

      if (response.redirected) {
        // window.location.href = response.url;
        window.location.href = "/home";
      } else {
        password.current.value = "";
        username.current.value = "";
        console.log("not redirected");
        return response.json();
      }
    }
  }

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const signinCheck = urlParams.get("signUp");

  function determineSignUp() {
    // if on signUp version
    if (signinCheck) {
      return (
        <button className="signUpBtn" onClick={() => createUser()}>
          Sign Up <i className="fa-solid fa-user-plus"></i>
        </button>
      );
    } else {
      return (
        <button className="signUpBtn" onClick={() => signIn()}>
          Log In <i className="fa-solid fa-right-to-bracket"></i>
        </button>
      );
    }
  }

  // jobrecruiter
  // job1234

  // "/src/img/wolfLogo.png"
  return (
    <>
      <div id="loginFlex">
        <section id="imgContainer">
          <img id="wolfGIF" src={logo} alt="" />
          {randomQuote}
        </section>
        <main id="loginContainer">
          <section id="title">
            <div className="titleSection">
              <img src={logo} alt="" />
              <h1>WOLF</h1>
            </div>
            <div className="titleSection">
              <h2>{signinCheck ? "Sign up" : "Login"}</h2>
            </div>
          </section>
          <form id="inputField">
            {/* for people demoing the app */}
            <div>
              <h3>USERNAME</h3>
              <input
                required
                ref={username}
                type="text"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <h3>PASSWORD</h3>
              <input
                required
                ref={password}
                type="password"
                placeholder="Enter your password"
              />
            </div>
          </form>
          <section id="optionalDecision">
            <div>
              <p>{signinCheck ? "Have an Account? " : "Don't have an account? "}
                <a href={signinCheck ? "/" : "/?signUp=true"} id="signUpLink">
                  {signinCheck ? "Login" : "Sign Up"}
                </a>
              </p>

            </div>
          </section>
          <div id="extraInfo">
            {/* error message */}
            <span>{loginErrorMessage}</span>
          </div>
          <div id="loginBtns">{determineSignUp()}</div>
        </main>
      </div>
    </>
  );
}
