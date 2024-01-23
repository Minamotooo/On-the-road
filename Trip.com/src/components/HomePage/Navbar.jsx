import React from "react";
import { ReactDOM } from "react";
import logo from "../images/logo-1.png";
import "./page.css"
  
export default function Navbar() {
    return (
        // <nav className="nav">
        //     <img src={logo} className="nav-logo" ></img>
        //     <section className="nav-content">
        //         <span className="selected">Tourist Spot</span>
        //         <span>Restaurant</span>
        //         <span>Hotel</span>
        //         <span>Transportation</span>
        //     </section>
            
        // </nav>


        <header className="navbar--container">
            <div>
                <img src={logo} alt="Trip.com logo" className="nav--logo"/>
            </div>
            <nav className="nav--Menu">
                <a href ="" className="navItem">Tourist Spot</a>
                <a href ="" className="navItem">Restaurant</a>
                <a href ="" className="navItem">Hotel</a>
                <a href ="" className="navItem">Transportation</a>
            </nav>
            <div className="button--container">
                <button className="signin--button">Login</button>
                <button className="signup--button">Register</button>
            </div>
        </header>
    )
}