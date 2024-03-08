import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Places.css";

export default function Spot(props) {
  const [neighboringSpots, setNeighboringSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch neighboring spots when the component mounts
    const fetchNeighboringSpots = async () => {
      try {
        const response = await fetch(
          `/Details/fetchneighboringspots/${props.spotId}`
        );
        const data = await response.json();
        setNeighboringSpots(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching neighboring spots:", error);
        setLoading(false);
      }
    };

    fetchNeighboringSpots();
  }, [props.spotId]);

  return (
    <div className="spot">
      <Link to={`/touristspot/${props.spotId}`}>
        <h1>{props.name}</h1>
      </Link>
      <h2>Description:</h2>
      <p>{props.blog_description}</p>
      <h2>Location:</h2>
      <p>{`${props.union}, ${props.upazilla}, ${props.district}, ${props.division}`}</p>

      {/* Display details of the current spot */}
      <h2>Details:</h2>
      <p>{/* Add details to display, e.g., props.image, etc. */}</p>

      {/* Display neighboring spots */}
      <h2>Neighboring Spots:</h2>
      {loading ? (
        <p>Loading neighboring spots...</p>
      ) : (
        <div className="neighboring-spots">
          {neighboringSpots.map((neighborSpot) => (
            <Link
              key={neighborSpot.spot_id}
              to={`/touristspot/${neighborSpot.spot_id}`}
            >
              <div className="neighbor-spot">
                <h3>{neighborSpot.name}</h3>
                <p>{neighborSpot.blog_description}</p>
                {/* Add more details as needed */}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
