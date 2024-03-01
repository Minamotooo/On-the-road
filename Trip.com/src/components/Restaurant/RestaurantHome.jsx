// Restaurant.jsx

import React, { useState } from "react";
import "./Restaurant.css";
import Navbar from "../HomePage/Navbar";
import SearchBar from "../hotel/SearchBar";

const restaurants = [
  {
    id: 1,
    name: "Cafe Fusion",
    cuisine: "Italian",
    rating: 4.5,
    address: "123 Main Street, Cityville",
  },
  {
    id: 2,
    name: "Spice Bistro",
    cuisine: "Indian",
    rating: 4.2,
    address: "456 Oak Avenue, Townsville",
  },
  {
    id: 3,
    name: "Sushi Haven",
    cuisine: "Japanese",
    rating: 4.7,
    address: "789 Pine Lane, Villagetown",
  },
];

const Restaurant = () => {
    const [selectedPriceRange, setSelectedPriceRange] = useState("");
    const [selectedDivision, setSelectedDivision] = useState("");
  
    const divisions = ["Dhaka", "Chattagram", "Khulna", "Rajshahi", "Sylhet", "Barishal", "Rangpur", "Mymensingh"];
    const priceranges = ["$", "$$", "$$$"];
  
    const handlePriceRange = (event) => {
      setSelectedPriceRange(event.target.value);
    };
  
    const handleDivision = (event) => {
      setSelectedDivision(event.target.value);
    };
  
    return (
      <div className="restaurant-list">
        <Navbar />
  
        <h2>Top-notch Restaurants</h2>
  
        <div className="dropdowns">
          <div className="dropdown">
            <label>Select Division:</label>
            <select
              id="divisionDropdown"
              value={selectedDivision}
              onChange={handleDivision}
            >
              <option value="">All Divisions</option>
              {divisions.map((division) => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </select>
          </div>
  
          <div className="dropdown">
            <label >Select Rating:</label>
            <select
              id="priceRangeDropdown"
              value={selectedPriceRange}
              onChange={handlePriceRange}
            >
              <option value="">Price Range</option>
              {priceranges.map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        <div className="search--bar">
          <SearchBar />
        </div>
  
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id} className="restaurant-item">
              <input
                type="radio"
                name="restaurant"
                id={`restaurant-${restaurant.id}`}
              />
              <label htmlFor={`restaurant-${restaurant.id}`}>
                <h3>{restaurant.name}</h3>
                <p>Cuisine: {restaurant.cuisine}</p>
                <p>Rating: {restaurant.rating}</p>
                <p>Address: {restaurant.address}</p>
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Restaurant;