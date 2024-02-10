import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./Places.css";

export default function Spot(props) {
  return (
    <div className="spot">
      {/* Use a different prop like spotId for the link, not props.key */}
      <Link to={`/touristspot/${props.spotId}`}>
        <h1>{props.name}</h1>
      </Link>
      <h2>Description:</h2>
      <p>{props.blog_description}</p>
      <p>
        <h2>Location:</h2>
        {`${props.union}, ${props.upazilla}, ${props.district}, ${props.division}`}
      </p>
    </div>
  );
}
