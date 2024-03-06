import React from "react";
import searchIcon from "../images/search.png"; // Make sure you have an icon image at this path
//import "./SearchBar.css"; // The CSS file for styling

const RestaurantSearchBar = ({ onChange }) => {
  return (
    <div className="searchcontainer">
      <div className="searchbar">
        <img src={searchIcon} alt="Search" className="search-icon" />
        <input
          type="text"
          placeholder="Search for restaurants..."
          onChange={onChange}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default RestaurantSearchBar;
