// Import the React useState hook
import React, { useState } from "react";
import LoginModal from "../Login/LoginModal"; // Adjust the path based on your file structure
import logo from "../images/logo-1.png";
import "./page.css";

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
                <img src={logo} alt="Trip.com logo" className="nav--logo"/>
            </div>
            <nav className="nav--Menu">
                <a href="" className="navItem">Tourist Spot</a>
                <a href="" className="navItem">Restaurant</a>
                <a href="" className="navItem">Hotel</a>
                <a href="" className="navItem">Transportation</a>
            </nav>
            <div className="button--container">
                {/* Attach the openLoginModal function to the onClick event */}
                <button onClick={openLoginModal} className="signin--button">Login</button>
                <button className="signup--button">Register</button>
            </div>

            {/* Conditionally render the LoginModal */}
            {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
        </header>
    );
}
