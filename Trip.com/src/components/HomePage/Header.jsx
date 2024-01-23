import React from "react";
import { ReactDOM } from "react-dom/client";
import large from "../images/1.png";
import small from "../images/2.png";
import "./Header.css";
  
export default function Header() {
    return (
        <div className="Header--container">
            <h1 className="header--text">
                Dare to live the life you've always wanted.
            </h1>
            <p className="header--subtext">
                Life is short and the world is wide. So, better get started.
            </p>
            <img src={large} alt="large--image" className="large--image"/>
            <img src={small} alt="smaller--image" className="smaller--image"/>
        </div>
    )
}