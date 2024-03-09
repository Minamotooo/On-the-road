import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Cards from "./Cards";
import DivisionSpots from "./DivisionSpots"; // Import the new component
import "./Places.css";

export default function Division({ divisions }) {
  const [selectedDivisionSpots, setSelectedDivisionSpots] = useState([]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const handleDivisionClick = async (division_Name) => {
    try {
      const response = await fetch(
        `http://localhost:4000/touristSpot/fetchDivisionWiseSpots/myDivision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ divisionName: division_Name.toString() }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSelectedDivisionSpots(data); // Set the division spots based on the divisionName
    } catch (error) {
      console.error("Error fetching division spots:", error);
      // Handle the error as needed
    }
  };

  // Check if divisions is an array and has elements
  if (!Array.isArray(divisions) || divisions.length === 0) {
    return <p>No divisions to display</p>;
  }

  return (
    <div>
      <h2> 8 divisions, endless adventures</h2>
      <Carousel responsive={responsive}>
        {divisions.map((division) => (
          <div
            key={division.id}
            onClick={() => handleDivisionClick(division.name)}
          >
            <Cards title={division.name} image={division.url} />
          </div>
        ))}
      </Carousel>

      {/* Render the DivisionSpots component with the selectedDivisionSpots */}
      <DivisionSpots divisionSpots={selectedDivisionSpots} />
    </div>
  );
}
