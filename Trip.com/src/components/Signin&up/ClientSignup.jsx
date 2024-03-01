import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientSignin from "./ClientSignin";
import "./in&up.css";

export default function ClientSignup({ onClose }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [district, setDistrict] = useState("");
  const [division, setDivision] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [roadName, setRoadName] = useState("");
  const [roadNumber, setRoadNumber] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showSignin, setShowSignin] = useState(false);

  const navigate = useNavigate();

  const GotoSignin = () => {
    setShowSignin(true);
  };

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:4000/signin/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          firstName,
          lastName,
          password,
          email,
          dateOfBirth,
          phoneNumber,
          profilePhoto,
          division,
          district,
          zipCode,
          houseNumber,
          roadNumber,
          roadName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        navigate("/");
        onClose();
        console.log("Registration successful");
      } else {
        // Registration failed, handle errors
        if (data.error.includes("Username")) {
          setUsernameError("Username already exists");
        } else if (data.error.includes("First Name")) {
          setFirstNameError("Invalid first name");
        } else if (data.error.includes("Last Name")) {
          setLastNameError("Invalid last name");
        } else if (data.error.includes("Password")) {
          setPasswordError("Invalid password");
        } else {
          // Handle other errors
          console.error(data.error);
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <>
      <div className="modal-wrapper"></div>
      <div className="modal-container2">
        <div>
          <h1 className="header">Signup</h1>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="input-container2">
          <div className="columns">
            <h4>Personal Info</h4>
            <input
              value={username}
              type="text" // ensure the password input hides the text
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
              className="input-style"
            />
            <label className="errorLabel">{usernameError}</label>
            <input
              value={firstName}
              type="text" // ensure the password input hides the text
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              className="input-style"
            />
            <label className="errorLabel">{firstNameError}</label>
            <input
              value={lastName}
              type="text" // ensure the password input hides the text
              placeholder="last Name"
              onChange={(e) => setLastName(e.target.value)}
              className="input-style"
            />
            <label className="errorLabel">{lastNameError}</label>
            <input
              value={password}
              type="password" // ensure the password input hides the text
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="input-style"
            />
            <label className="errorLabel">{passwordError}</label>
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="input-style"
            />

            <input
              value={dateOfBirth}
              type="date" // ensure the password input hides the text
              placeholder="Date of Birth"
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="input-style"
            />
            <input
              value={phoneNumber}
              type="text" // ensure the password input hides the text
              placeholder="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input-style"
            />
            <input
              value={profilePhoto}
              type="text" // ensure the password input hides the text
              placeholder="Upload the URL"
              onChange={(e) => setProfilePhoto(e.target.value)}
              className="input-style"
            />
          </div>

          <div className="columns">
            <h4>Address</h4>
            <input
              value={division}
              type="text" // ensure the password input hides the text
              placeholder="Division"
              onChange={(e) => setDivision(e.target.value)}
              className="input-style"
            />
            <input
              value={district}
              type="text" // ensure the password input hides the text
              placeholder="District"
              onChange={(e) => setDistrict(e.target.value)}
              className="input-style"
            />

            <input
              value={zipCode}
              type="text" // ensure the password input hides the text
              placeholder="Zip Code"
              onChange={(e) => setZipCode(e.target.value)}
              className="input-style"
            />
            <input
              value={houseNumber}
              type="text" // ensure the password input hides the text
              placeholder="House No."
              onChange={(e) => setHouseNumber(e.target.value)}
              className="input-style"
            />
            <input
              value={roadNumber}
              type="text" // ensure the password input hides the text
              placeholder="Road No."
              onChange={(e) => setRoadNumber(e.target.value)}
              className="input-style"
            />
            <input
              value={roadName}
              type="text" // ensure the password input hides the text
              placeholder="Road Name"
              onChange={(e) => setRoadName(e.target.value)}
              className="input-style"
            />
          </div>
        </div>
        <div>
          <button className="button--style" onClick={handleSignup}>
            Sign up
          </button>
          <p>
            Already have an account?{" "}
            <button className="link" onClick={GotoSignin}>
              Sign in!
            </button>
          </p>
        </div>
      </div>

      <p>hello</p>

      {showSignin && <ClientSignin onClose={onClose} />}
    </>
  );
}
