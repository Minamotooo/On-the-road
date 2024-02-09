import React, { useState } from 'react';
import searchIcon from "../images/search.png";
import "./style.css";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
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
  );
}

export default SearchBar;
