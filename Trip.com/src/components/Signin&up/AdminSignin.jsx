import React, { useEffect, useState } from "react";
import "./in&up.css";
import { useNavigate } from "react-router-dom";

export default function AdminSignin({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleSignin = async () => {
    setEmailError("");
    setPasswordError("");

    if (!email && !password) {
      setEmailError("Email field cannot be empty");
      setPasswordError("Password field cannot be empty");
      return;
    } else if (!email) {
      setEmailError("Email field cannot be empty");
      return;
    } else if (!password) {
      setPasswordError("Password field cannot be empty");
      return;
    }

    if (email === "Admin" && password === "1") {
      navigate("/admin");
      onClose();
    }
  };

  return (
    <>
      <div className="modal-wrapper"></div>
      <div className="modal-container">
        <div>
          <h1 className="header">Welcome Back!</h1>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="input-container">
          <input
            type="text"
            value={email}
            placeholder="Username"
            onChange={(e) => setEmail(e.target.value)}
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
        </div>

        <div>
          <button className="button--style btn" onClick={handleSignin}>
            Sign in
          </button>
        </div>
      </div>
    </>
  );
}
