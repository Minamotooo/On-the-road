import React from "react";
import "./NeighboringSpotCard.css"; // You can create a CSS file for styling

const NeighboringSpotCard = ({ data }) => {
  return (
    <div className="neighboring-spot-card">
      <img
        src={data.image}
        alt={data.name}
        style={{ maxWidth: "100%", height: "150px" }}
      />
      <h3>{data.name}</h3>
      <p>{data.blog_description}</p>
    </div>
  );
};

export default NeighboringSpotCard;
