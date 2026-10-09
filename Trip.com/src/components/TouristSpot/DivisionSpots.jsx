import React from "react";
import { PhotoCard, SectionHead, placeName } from "../Shared/ui";

const DivisionSpots = ({ division, divisionSpots }) => {
  if (!division) return null;

  return (
    <section className="otr-section">
      <SectionHead
        kicker={`${divisionSpots.length} place${divisionSpots.length === 1 ? "" : "s"} to see`}
        title={
          <>
            Explore <span className="bd">{division}</span>
          </>
        }
      />
      {divisionSpots.length === 0 ? (
        <p className="otr-empty">No spots added for this division yet.</p>
      ) : (
        <div className="otr-grid">
          {divisionSpots.map((spot) => (
            <PhotoCard
              key={spot.spot_id}
              to={`/touristspot/${spot.spot_id}`}
              image={spot.image}
              title={spot.name}
              rating={spot.average_rating}
              location={placeName(spot.district_name)}
              description={spot.blog_description}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default DivisionSpots;
