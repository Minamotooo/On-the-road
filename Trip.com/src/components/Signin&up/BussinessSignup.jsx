import React, { useState,useEffect } from "react";
import HotelSignup from "./HotelSignup";
import RestaurantSignup from "./RestaurantSignup";
import TravelAgencySignup from "./TravelAgencySignup";
import TourGuideSignup from "./TourGuideSignup";


export default function BussinessSignup({onClose}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [username, setUsername] = useState("");
  const [bussinessType, setBussinessType] = useState("");
  const [next,setNext] = useState(false);

  // Simulate fetching data from a database

  const nextPage = () => {
    if (bussinessType) {
      setNext(true);
    } else {
      // Optionally, handle the error case where no business type is selected
      alert('Please select a business type.');
    }
  };

  const BUSINESS_COMPONENTS = {
    Restaurant: RestaurantSignup,
    Hotel: HotelSignup,
    "Travel Agency": TravelAgencySignup,
    "Tour Guide": TourGuideSignup,
  };

  // Function to get the business signup component based on the business type
  const getBusinessSignupComponent = () => {
    const SignupComponent = BUSINESS_COMPONENTS[bussinessType];
    return SignupComponent ? <SignupComponent onClose={onClose} email={email} username={username}  /> : null;
  };


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
          <p>Bussiness Type</p>
            <div className="radio-container">
  <label className="custom-radio">
    <input 
      type="radio" 
      name="business-type" 
      value="Restaurant" 
      checked={bussinessType === "Restaurant"}
      onChange={(e) => setBussinessType(e.target.value)}
    />
    <span>Restaurant</span>
  </label>
  <label className="custom-radio">
    <input 
      type="radio" 
      name="business-type" 
      value="Hotel" 
      checked={bussinessType === "Hotel"}
      onChange={(e) => setBussinessType(e.target.value)}
    />
    <span>Hotel</span>
  </label>
  <label className="custom-radio">
    <input
      type="radio"
      name="business-type"
      value="Travel Agency"
      checked={bussinessType === "Travel Agency"}
      onChange={(e) => setBussinessType(e.target.value)}
    />
    <span>Travel Agency</span>
  </label>
  <label className="custom-radio">
    <input
      type="radio" 
      name="business-type" 
      value="Tour Guide" 
      checked={bussinessType === "Tour Guide"}
      onChange={(e) => setBussinessType(e.target.value)}
    />
    <span>Tour Guide</span>
  </label>
</div>
        </div>

        <div>
          <button className="button--style" onClick={nextPage}>Next</button>
          <p>
            Already a member? <button className="link">Sign in!</button>
          </p>
        </div>
        {next && getBusinessSignupComponent()}
      </div>
    </>
  );
}
