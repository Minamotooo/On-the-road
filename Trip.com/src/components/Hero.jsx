import React from "react";
import { ReactDOM } from "react";
import logo from "../images/Group.png"
import "./page.css"
  
export default function Hero() {
    return (
        <div className="hero">
            <img src={logo} className="hero-photo"></img>
            <h1 className="hero-header">
                Online Experiences
            </h1>
            <p className="hero-content">
                Join unique interactive activities led by one-of-a-kind hosts—all without leaving home.

            </p>
        </div>
    )
}