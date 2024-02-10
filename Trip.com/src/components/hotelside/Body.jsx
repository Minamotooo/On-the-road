import React from "react";
import "./hotel.css";

export default function Body(props) {
  return (
    <div className="hotel-header">
      <h1>{props.name}</h1>
      <div className="hotel-rating">
        <span className="rating-dots">
          {/* Assuming 5 green dots represent the best rating */}
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </span>
      </div>
      <div className="hotel-location">{props.address}</div>
      {/* Icons can be added as needed */}

      <div className="hotel-overview">
        <div className="about-section">
          <h2>About</h2>

          {/* Additional rating details */}
          <p className="hotel-description">
            {props.description}
            {/* Truncated for brevity */}
          </p>
          {/* Toggle for read more or read less */}
        </div>
      </div>
    </div>
  );
}
