import React, {useEffect,useState} from "react";
import "./in&up.css";


export default function AdminSignin({onClose}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");


    return(
        <>
            <div className="modal-wrapper"></div>
            <div className="modal-container">

            <div>
                <h1 className="header">Welcome Back!</h1>
                <button type="button" className="close-button" onClick={onClose}>&times;</button>
            </div>

            <div className="input-container">
                    <input
                        type="text"
                        value={email}
                        placeholder="Username"
                        onChange={e => setEmail(e.target.value)}
                        className="input-style" />
                    <label className="errorLabel">{emailError}</label>
                
                    <input
                        value={password}
                        type="password" // ensure the password input hides the text
                        placeholder="Password"
                        onChange={e => setPassword(e.target.value)}
                        className="input-style" />
                    <label className="errorLabel">{passwordError}</label>
                </div>

            <div>
                
                <button className="button--style" >Sign in</button>
                <p>Don't have an account? <button className="link">Create one!</button></p>
            </div>
            </div>
        </>
    )
}

