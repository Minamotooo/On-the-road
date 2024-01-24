import React,  { useState } from "react";
import ReactDOM from "react-dom/client";
import "./Modal.css";
import logo from "../images/logo-1.png";



const LoginModal = ({ onClose }) => {

////state variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

/// Function to handle the 'Log in' button click
    const onButtonClick = () => {
        // TODO: Implement the login logic here
        console.log('Login button clicked');
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
            </div>
        </div>
    );
};

export default LoginModal;
