// // Import the React useState hook
// import React, { useState } from "react";
// // Correct way to import Link and other named exports
// import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import LoginAs from "../Login/LoginAs"; // Adjust the path based on your file structure
// import logo from "../images/logo-1.png";
// import "./page.css";
// import Entity from "../Signin&up/Entity";

// export default function Navbar() {
//     // State to manage the visibility of the login modal
//     const [isLoginModalOpen, setLoginModalOpen] = useState(false);

//     // Function to open the login modal
//     const openLoginModal = () => {
//         setLoginModalOpen(true);
//     };

//     // Function to close the login modal
//     const closeLoginModal = () => {
//         setLoginModalOpen(false);
//     };

//     return (
//         <header className="navbar--container">
//             <div>
//                 <Link to="/" >
//                 <img src={logo} alt="Trip.com logo" className="nav--logo" />
//                 </Link>
//             </div>
//             <nav className="nav--Menu">
//                 <a href="/touristspot" className="navItem">Tourist Spot</a>
//                 <a href="" className="navItem">Restaurant</a>
//                 <a href="/hotel" className="navItem">Hotel</a>
//                 <a href="" className="navItem">Transportation</a>
//             </nav>
//             <div className="button--container">
//                 {/* Attach the openLoginModal function to the onClick event */}
//                 <button onClick={openLoginModal} className="signin--button">Login</button>
//                 <button className="signup--button">Register</button>
//             </div>

//             {/* Conditionally render the LoginModal */}
//             {isLoginModalOpen && <Entity onClose={closeLoginModal} />} {/* props passing*/}
//         </header>
//     );
// }

// Import the React useState hook
import React, { useState } from "react";
// Correct way to import Link and other named exports
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext"; // Adjust the path accordingly
import Entity from "../Signin&up/Entity";
import logo from "../images/logo-1.png";
import "./page.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  // State to manage the visibility of the login modal
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  // Access user information using the useAuth hook
  const { user, logout } = useAuth();
  //console.log(user.username);
  // Sample user data
  //user = { username: "user1", role: "client" };
  // Function to open the login modal
  const navigate = useNavigate();


  const navigateToDashboard = () => {
    navigate(`/${user.role}/${user.username}`); // Replace "/dashboard" with the actual path to your dashboard
  };


  const openLoginModal = () => {
    setLoginModalOpen(true);
  };
  const navigateToHome = () => {
    navigate("/");
  };

  // Function to close the login modal
  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  return (
    <header className="navbar--container">
      <div>
        <Link to="/">
          <img src={logo} alt="Trip.com logo" className="nav--logo" />
        </Link>
      </div>
      <nav className="nav--Menu">
        <a href="/touristspot" className="navItem">
          Tourist Spot
        </a>
        <a href="" className="navItem">
          Restaurant
        </a>
        <a href="/hotel" className="navItem">
          Hotel
        </a>
        <a href="" className="navItem">
          Transportation
        </a>
      </nav>
      <div className="button--container">
        {user ? ( // Check if a user is logged in
          <>
            {/* Display the username */}
            <button onClick={navigateToDashboard} className="signup--button">
              {user.username}
            </button>
            {/* Attach the logout function to the onClick event */}
            <button onClick={() => { logout(); navigateToHome(); }} className="signin--button">
              Logout
            </button>
          </>
        ) : (
          // If no user is logged in, display login and signup buttons
          <>
            {/* Attach the openLoginModal function to the onClick event */}
            <button onClick={openLoginModal} className="signin--button">
              Login
            </button>
            <button className="signup--button">Register</button>
          </>
        )}
      </div>
      {/* Conditionally render the LoginModal */}
      {isLoginModalOpen && <Entity onClose={closeLoginModal} />}{" "}
      {/* props passing*/}
    </header>
  );
}
