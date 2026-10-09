import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { API, SectionHead } from "../Shared/ui";
import DivisionSpots from "./DivisionSpots";

const responsive = {
  desktop: { breakpoint: { max: 4000, min: 1100 }, items: 4, slidesToSlide: 2 },
  laptop: { breakpoint: { max: 1100, min: 800 }, items: 3 },
  tablet: { breakpoint: { max: 800, min: 500 }, items: 2 },
  mobile: { breakpoint: { max: 500, min: 0 }, items: 1 },
};

export default function Division({ divisions }) {
  const [selected, setSelected] = useState("");
  const [selectedDivisionSpots, setSelectedDivisionSpots] = useState([]);

  const handleDivisionClick = async (divisionName) => {
    setSelected(divisionName);
    try {
      const response = await fetch(`${API}/touristSpot/fetchDivisionWiseSpots/myDivision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ divisionName: divisionName.toString() }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setSelectedDivisionSpots(await response.json());
    } catch (error) {
      console.error("Error fetching division spots:", error);
    }
  };

  // Open on the first division so the page never starts empty
  useEffect(() => {
    if (!selected && Array.isArray(divisions) && divisions.length > 0) {
      handleDivisionClick(divisions[0].name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divisions]);

  if (!Array.isArray(divisions) || divisions.length === 0) {
    return <p className="otr-empty">Loading divisions…</p>;
  }

  return (
    <>
      <section className="otr-section">
        <SectionHead kicker="Pick a division" title="8 divisions, endless adventures" />
        <Carousel responsive={responsive} className="otr-carousel" showDots infinite>
          {divisions.map((division) => (
            <div
              key={division.name}
              className={`otr-tile ${selected === division.name ? "otr-tile--on" : ""}`}
              onClick={() => handleDivisionClick(division.name)}
            >
              <img src={division.url} alt={division.name} draggable="false" />
              <span>{division.name}</span>
            </div>
          ))}
        </Carousel>
      </section>

      <DivisionSpots division={selected} divisionSpots={selectedDivisionSpots} />
    </>
  );
}
