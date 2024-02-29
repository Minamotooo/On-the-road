import React, { useEffect, useState } from "react";
import "./in&up.css";
import ClientSignup from "./ClientSignup";
import { useNavigate } from "react-router-dom";

export default function ClientSignin({ onClose }) {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setusernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const setFieldError = (field, message) => {
    switch (field) {
      case "username":
        setusernameError(message);
        break;
      case "password":
        setPasswordError(message);
        break;
      default:
        break;
    }
  };
  const [showSignup, setShowSignup] = useState(false);

  const GotoSignup = () => {
    setShowSignup(true);
  };

  /// Function to handle the 'Log in' button click
  const handleSignIn = async () => {
    setusernameError("");
    setPasswordError("");
    setServerError("");
  
    try {
      const response = await fetch("http://localhost:4000/signin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      if (response.ok) {
        const userData = await response.json();
        if (userData && userData.success) {
          const username = userData.user.username;
          console.log(username);
          navigate(`/client/${username}`);
        } else {
          setServerError("Unexpected response from server");
        }
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          // Handle 401 status (Unauthorized) for authentication errors
          if (errorData && errorData.error) {
            if (errorData.error.includes("User not found")) {
              setFieldError("username", "User doesn't exist");
            } else if (errorData.error.includes("Incorrect username or password")) {
              setFieldError("password", "Incorrect password");
            } else {
              setServerError(errorData.error);
            }
          }
        } else {
          // Handle other error statuses
          setServerError(`Server Error: ${response.status}`);
        }
      }
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
      setServerError("Unexpected error during sign-in");
    }
  };
  
  

  return (
    <>
      <div className="modal-wrapper"></div>
      <div className="modal-container">
        <div>
          <h1 className="header">Welcome Back!</h1>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="input-container">
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setusername(e.target.value)}
            className="input-style"
          />
          <label className="errorLabel">{usernameError}</label>

          <input
            value={password}
            type="password" // ensure the password input hides the text
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="input-style"
          />
          <label className="errorLabel">{passwordError}</label>
        </div>

        <div>
          <button className="button--style" onClick={handleSignIn}>
            Sign in
          </button>
          <p>
            Don&apos;t have an account?{" "}
            <button className="link" onClick={GotoSignup}>
              Create one!
            </button>
          </p>
        </div>
      </div>

      {showSignup && <ClientSignup onClose={onClose} />}
    </>
  );
}
