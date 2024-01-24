import React from "react";
import ReactDOM from "react-dom/client";
import './App.css'
import Navbar from "./components/HomePage/Navbar";
import Card from "./components/HomePage/Card";
import data from "./components/data.js";
import Header from "./components/HomePage/Header.jsx";

import Popular from "./components/HomePage/Popular.jsx";
import Footer from "./components/HomePage/Footer.jsx";
import Places from "./components/TouristSpot/Places.jsx";


export default function App() {

    
    return (
        <div>
            {/* <Navbar />
            <Header />
            <Popular />
            <Footer /> */}
            <Places />
            
        </div>
    )
}