import React from 'react';

function TouristSpots({ spots }) {
  return (
    <div>
      {spots.map((spot, index) => (
        <div key={index}>
          <h3>{spot.name}</h3>
          <p>{spot.description}</p>
          {/* Add more details as needed */}
        </div>
      ))}
    </div>
  );
}

export default TouristSpots;
