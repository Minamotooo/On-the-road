import React from "react";
import SearchBar from "./SearchBar";
import Card from "./HotelCard";
import Navbar from "../HomePage/Navbar"

export default function Hotel() {
    return(
        <>
        <Navbar />
        <div className="relative-container">
        <SearchBar/>
        <Card />
        </div>

        </>
        );
}