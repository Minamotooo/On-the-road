import React, { useState } from "react";

export default function BussinessSignup({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [username, setUsername] = useState("");
  const [bussinessType, setBussinessType] = useState("");

  return (
    <>
      <div className="modal-wrapper"></div>
      <div className="modal-container">
        <div>
          <h1 className="header">Create Account</h1>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="input-container">
          <input
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="input-style"
          />
          <label className="errorLabel">{emailError}</label>
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="input-style"
          />
          <label className="errorLabel">{emailError}</label>

          <input
            value={password}
            type="password" // ensure the password input hides the text
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="input-style"
          />
          <label className="errorLabel">{passwordError}</label>
          <input
            value={password}
            type="password" // ensure the password input hides the text
            placeholder="Confirm Password"
            onChange={(e) => setPassword(e.target.value)}
            className="input-style"
          />
          <label className="errorLabel">{passwordError}</label>
          <h4>Bussiness Type</h4>
          <div className="radio-group">
            <label className="custom-radio">
              <input type="radio" name="bussiness-type" value="Restaurant" />
              <span className="radio-btn"></span>
              Restaurant
            </label>
            <label className="custom-radio">
              <input type="radio" name="bussiness-type" value="Hotel" />
              <span className="radio-btn"></span>
              Hotel
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="bussiness-type"
                value="Travel Agency"
              />
              <span className="radio-btn"></span>
              Travel Agency
            </label>
            <label className="custom-radio">
              <input type="radio" name="bussiness-type" value="Tour Guide" />
              <span className="radio-btn"></span>
              Tour Guide
            </label>
          </div>
        </div>

        <div>
          <button className="button--style">Next</button>
          <p>
            Already a member? <button className="link">Sign in!</button>
          </p>
        </div>
      </div>
    </>
  );
}
