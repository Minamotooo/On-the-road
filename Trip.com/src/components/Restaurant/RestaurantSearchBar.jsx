import React from "react";
import "../Shared/otr.css";

const RestaurantSearchBar = ({ value, onChange }) => {
  return (
    <form className="otr-search" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Search restaurants by name…"
        value={value}
        onChange={onChange}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default RestaurantSearchBar;
