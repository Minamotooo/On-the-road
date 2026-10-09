import React from "react";
import "../Shared/otr.css";

export default function SearchBar({ value, onChange, placeholder = "Where to stay? Try Cox's Bazar or Sylhet" }) {
  return (
    <form className="otr-search" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
