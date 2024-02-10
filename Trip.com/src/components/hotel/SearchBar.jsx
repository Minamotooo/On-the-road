import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../images/Search.png"; // Make sure you have an icon image at this path
import HotelCard from "./HotelCard";
import "./SearchBar.css"; // The CSS file for styling

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  const handleHotelClick = (hotelId) => {
    // Directly navigate to the hotel's detail page
    navigate(`/clientsidehotelpage/${hotelId}`);
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch("http://localhost:4000/hotel/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ searchTerm: searchTerm }),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log(data);
          setSuggestions(data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <div>
      <div className="searchcontainer">
        <div className="searchbar">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Where to stay?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      <div className="search-results">
        {suggestions.length > 0 && (
          <div>
            <h2 className="card--list">Search Results</h2>
            <section className="card--list">
              {suggestions.map((hotel) => (
                <HotelCard
                  key={hotel.hotel_id}
                  data={hotel}
                  onClick={() => handleHotelClick(hotel.hotel_id)}
                />
              ))}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
