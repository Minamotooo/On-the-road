import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Modal.css";
import logo from "../images/logo-1.png";



const LoginModal = ({ onClose }) => {

////state variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    const setFieldError = (field, message) => {
        switch (field) {
          case "email":
            setEmailError(message);
            break;
          case "password":
            setPasswordError(message);
            break;
          default:
            break;
        }
      };

/// Function to handle the 'Log in' button click
const onButtonClick = async () => {
    setEmailError("");
    setPasswordError("");
  
    if (!email) {
      setFieldError("email", "Email field cannot be empty");
      return; // Stop further execution
    }
    if (!password) {
      setFieldError("password", "Password field cannot be empty");
      return; // Stop further execution
    }
  
    const response = await fetch("http://localhost:4000/signin/hotel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  
    if (response.ok) {
      const userData = await response.json();
      if (userData && userData.user) {
        const username = userData.user.username;
        navigate(`/user/${username}`);
      } else {
        // This block will be executed if the server responds with 401 or 402
        const errorData = await response.json();
        if (errorData && errorData.error) {
          if (errorData.error.includes("exist")) {
            setFieldError("email", "User doesn't exist");
          } else if (errorData.error.includes("Password")) {
            setFieldError("password", "Incorrect password");
          }
        }
      }
    } else {
      // Handle non-OK responses (e.g., server errors)
      console.error("Server error:", response.status, response.statusText);
    }
  };
  

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <div className="modal-header">
                    <img src={logo} alt="On the road" className='header--logo' />
                    <button type="button" className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className={"mainContainer"}>
                <div className="inputContainer">
                    <input
                        value={email}
                        placeholder="Enter your email here"
                        onChange={e => setEmail(e.target.value)}
                        className="inputBox" />
                    <label className="errorLabel">{emailError}</label>
                </div>

                <div className="inputContainer">
                    <input
                        value={password}
                        type="password" // ensure the password input hides the text
                        placeholder="Enter your password here"
                        onChange={e => setPassword(e.target.value)}
                        className="inputBox" />
                    <label className="errorLabel">{passwordError}</label>
                </div>
                <br />
                <div className="inputContainer">
                    <input
                        className="inputButton"
                        type="button"
                        onClick={onButtonClick}
                        value="Log in" />
                </div>
                </div>
                    <p className="link">
            Don't have an account?{" "}
            <Link to="/signup">Create an account. SignUp</Link>
        </p>
            </div>
        </div>
    );
};

export default LoginModal;
