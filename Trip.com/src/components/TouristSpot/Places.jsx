import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import Navbar from "../HomePage/Navbar";
import cover from "../images/cover.png";
import "./Places.css"


export default function Places({onSearch}) {
    const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(searchTerm); // Prop function to handle the search term
  };
    return (
        <div className="body">
            <Navbar />
            <div className="search-container">
      <h1>Explore Italy like a local</h1>
      <p>From iconic attractions to amazing experiences, your journey begins here</p>
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Where do you want to go?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍
        </button>
      </form>
    </div>
        </div>
    )
}