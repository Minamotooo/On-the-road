import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./Navbar";
import Header from "./Header";
import Popular from "./Popular";

export default function HomePage() {
    return (
        <div>
            <Navbar />
            <Header />
            <Popular />
        </div>
    )
}