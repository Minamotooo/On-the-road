// Restaurant.jsx

import React, { useEffect, useState } from "react";
import Navbar from "../HomePage/Navbar";
import "./Restaurant.css";
import RestaurantSearchBar from "./RestaurantSearchBar";

// const restaurants = [
//   {
//     id: 1,
//     name: "Cafe Fusion",
//     cuisine: "Italian",
//     rating: 4.5,
//     address: "123 Main Street, Cityville",
//   },
//   {
//     id: 2,
//     name: "Spice Bistro",
//     cuisine: "Indian",
//     rating: 4.2,
//     address: "456 Oak Avenue, Townsville",
//   },
//   {
//     id: 3,
//     name: "Sushi Haven",
//     cuisine: "Japanese",
//     rating: 4.7,
//     address: "789 Pine Lane, Villagetown",
//   },
// ];

const Restaurant = () => {
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const priceranges = ["$", "$$", "$$$"];

  useEffect(() => {
    // Fetch the Division options
    const fetchDivisions = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/hotelSignUp/divisions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: "Get divisions",
            }),
          }
        );
        console.log("Request sent");
        console.log(response);
        if (response.ok) {
          console.log("Response received");
          const data = await response.json();
          console.log(data);
          setDivisions(
            data.success ? data.data.map((division) => division.name) : []
          );
        } else {
          const errorMessage = await response.text();
          setError(
            `Error getting division: ${errorMessage || response.statusText}`
          );
        }
      } catch (error) {
        setError(`Error getting division: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDivisions();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch the restaurants based on the selected filters and search term
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        console.log(searchTerm, selectedDivision, selectedPriceRange);

        const response = await fetch(
          "http://localhost:4000/restaurant/search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              division: selectedDivision,
              priceRange: selectedPriceRange,
              searchTerm: searchTerm, // Add the search term to the request
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Printing data: ");
          console.log(data);
          setRestaurants(data);
          console.log("Printing restaurants: ");
          console.log(restaurants);
        } else {
          const errorMessage = await response.text();
          setError(
            `Error getting restaurants: ${errorMessage || response.statusText}`
          );
        }
      } catch (error) {
        setError(`Error getting restaurants: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [selectedDivision, selectedPriceRange, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

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
          <label>Select Rating:</label>
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
        <RestaurantSearchBar onChange={handleSearch} />
      </div>

      <ul>
        {restaurants.map((restaurant, key) => (
          <li key={key} className="restaurant-item">
            <input
              type="radio"
              name="restaurant"
              id={`restaurant-${restaurant.id}`}
            />
            <label htmlFor={`restaurant-${restaurant.id}`}>
              <h3>{restaurant.name}</h3>
              <p>Cuisine: {restaurant.cuisine}</p>
              <p>Address: {restaurant.address}</p>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Restaurant;
