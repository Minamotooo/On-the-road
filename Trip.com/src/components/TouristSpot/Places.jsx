import React, { useState, useEffect } from "react";
import Navbar from "../HomePage/Navbar";
import searchIcon from "../images/search.png";
import "./Places.css";
import Division from "./Division";
import Spot from "./Spot";

export default function Places() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch('http://localhost:4000/touristSpot/home', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchterm: searchTerm }),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]); 
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/touristSpot/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchterm: searchTerm }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data); // Set the search results based on the search term
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]); 
    }
  };

  const show = searchResults.map((result) => (
    <Spot 
      key={result.spot_id}
      name={result.name}
      description={result.description}
      division={result.division}
    />
  ));

  return (
    <div className="body">
      <Navbar />
      <div className="search-container">
        <h1>Explore Bangladesh</h1>
        <p>From iconic attractions to amazing experiences, your journey begins here</p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Where do you want to go?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <img src={searchIcon} alt="search" className="search" />
          </button>
        </form>
      </div>
      <Division />
      <section>
        {show}
      </section>
    </div>
  );
}
