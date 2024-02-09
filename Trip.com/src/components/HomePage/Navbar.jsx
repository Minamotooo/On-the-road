// Import the React useState hook
import React, { useState } from "react";
// Correct way to import Link and other named exports
import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginAs from "../Login/LoginAs"; // Adjust the path based on your file structure
import logo from "../images/logo-1.png";
import "./page.css";
import Entity from "../Signin&up/Entity";

export default function Navbar() {
    // State to manage the visibility of the login modal
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);


    

    // Function to open the login modal
    const openLoginModal = () => {
        setLoginModalOpen(true);
    };

    // Function to close the login modal
    const closeLoginModal = () => {
        setLoginModalOpen(false);
    };

    return (
        <header className="navbar--container">
            <div>
                <Link to="/" >
                <img src={logo} alt="Trip.com logo" className="nav--logo" />
                </Link>
            </div>
            <nav className="nav--Menu">
                <a href="/touristspot" className="navItem">Tourist Spot</a>
                <a href="" className="navItem">Restaurant</a>
                <a href="/hotel" className="navItem">Hotel</a>
                <a href="" className="navItem">Transportation</a>
            </nav>
            <div className="button--container">
                {/* Attach the openLoginModal function to the onClick event */}
                <button onClick={openLoginModal} className="signin--button">Login</button>
                <button className="signup--button">Register</button>
            </div>

            {/* Conditionally render the LoginModal */}
            {isLoginModalOpen && <Entity onClose={closeLoginModal} />} {/* props passing*/}
        </header>
    );
}
