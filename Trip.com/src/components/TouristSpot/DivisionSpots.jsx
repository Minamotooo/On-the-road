import React from "react";
import "./DivisionSpots.css"; // Import your CSS file for styling

const DivisionSpots = ({ divisionSpots }) => {
  // Check if divisionSpots is an array and has elements
  if (!Array.isArray(divisionSpots) || divisionSpots.length === 0) {
    return <p>No spots to display</p>;
  }

  return (
    <div className="division-spots-container">
      <h2>Explore the Division of Your Choice</h2>
      <div className="spot-cards">
        {divisionSpots.map((spot) => (
          <div key={spot.spot_id} className="spot-card">
            <img src={spot.image} alt={spot.name} className="spot-image" />
            <div className="spot-details">
              <h3>{spot.name}</h3>
              <p>{spot.blog_description}</p>
              {/* Add more details or styling as needed */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DivisionSpots;
