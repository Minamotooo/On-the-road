import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Cards from "./Cards";
import "./Places.css";
// Import images

export default function Division({ divisions }) {
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

  // Check if divisions is an array and has elements
  if (!Array.isArray(divisions) || divisions.length === 0) {
    // You can add a loading state or return some fallback UI here
    return <p>No divisions to display</p>;
  }

  return (
    <div>
      <h2> 8 divisions, endless adventures</h2>
      <Carousel responsive={responsive}>
        {divisions.map((division) => (
          <Cards key={division.id} title={division.name} image={division.url} />
        ))}
      </Carousel>
    </div>
  );
}
