import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

import BussinessSignup from "./BussinessSignup";
import "./in&up.css";

export default function BussinessSignin({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [businessType, setbusinessType] = useState("");
  const [signup, setSignup] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();

  const setFieldError = (field, message) => {
    switch (field) {
      case "username":
        setUsernameError(message);
        break;
      case "password":
        setPasswordError(message);
        break;
      default:
        break;
    }
  };

  const handleSignin = async () => {
    setUsernameError("");
    setPasswordError("");

    if (!businessType) {
      alert("Please select a business type.");
      return;
    }

    if (!username && !password) {
      setFieldError("username", "Username field cannot be empty");
      setFieldError("password", "Password field cannot be empty");
      return;
    } else if (!username) {
      setFieldError("username", "Username field cannot be empty");
      return;
    } else if (!password) {
      setFieldError("password", "Password field cannot be empty");
      return;
    }

    const response = await fetch("http://localhost:4000/signin/hotellogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        businessType,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success) {
        console.log(data);
        const username = data.retrievedData.username;
        login(data.user);
        //console.log("USER OBJECT: ", data.user);
        //console.log(
        //   "............................................................................................."
        // );
        navigate(`/${businessType}/${username}`);
      } else {
        const data = await response.json();
        if (data) {
          if (data?.status === 401) {
            setFieldError("username", data.error);
          } else if (data?.status === 402) {
            setFieldError("password", data.error);
          }
        }
      }
    } else {
      alert("Server is down!");
    }
  };

  const GotoSignup = () => setSignup(true);

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
          <p>Bussiness Type</p>
          <div className="radio-container">
            <label className="custom-radio">
              <input
                type="radio"
                name="business-type"
                value="Restaurant"
                checked={businessType === "Restaurant"}
                onChange={(e) => setbusinessType(e.target.value)}
              />
              <span>Restaurant</span>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="business-type"
                value="Hotel"
                checked={businessType === "Hotel"}
                onChange={(e) => setbusinessType(e.target.value)}
              />
              <span>Hotel</span>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="business-type"
                value="Travel Agency"
                checked={businessType === "Travel Agency"}
                onChange={(e) => setbusinessType(e.target.value)}
              />
              <span>Travel Agency</span>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="business-type"
                value="Tour Guide"
                checked={businessType === "Tour Guide"}
                onChange={(e) => setbusinessType(e.target.value)}
              />
              <span>Tour Guide</span>
            </label>
          </div>
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className={`input-style ${usernameError ? "input-error" : ""}`}
          />
          {usernameError && (
            <div className="error-message">{usernameError}</div>
          )}

          <input
            value={password}
            type="password" // ensure the password input hides the text
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className={`input-style ${passwordError ? "input-error" : ""}`}
          />
          {passwordError && (
            <div className="error-message">{passwordError}</div>
          )}
        </div>

        <div>
          <button className="button--style" onClick={handleSignin}>
            Sign in
          </button>
          <p>
            Don't have an account?{" "}
            <button className="link" onClick={GotoSignup}>
              Create one!
            </button>
          </p>
        </div>
        {signup && <BussinessSignup onClose={onClose} />}
      </div>
    </>
  );
}
