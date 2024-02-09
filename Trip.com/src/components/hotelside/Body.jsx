import React from "react";
import "./hotel.css"

export  default function Body() {
return(
    <div className="hotel-header">
      <h1>Sayeman Beach Resort</h1>
      <div className="hotel-rating">
        <span className="rating-dots">
          {/* Assuming 5 green dots represent the best rating */}
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </span>
        <span className="reviews-count">2,064 reviews</span>
        <span className="review-summary">NEW AI Review Summary</span>
        <span className="hotel-ranking">#1 of 45 hotels in Cox's Bazar</span>
      </div>
      <div className="hotel-location">
        Marine Drive Road, Cox's Bazar 4700 Bangladesh
      </div>
      <button className="check-availability">Edit Profile</button>
      {/* Icons can be added as needed */}


      <div className="hotel-overview">
      <div className="about-section">
        <h2>About</h2>
        <div className="rating-overview">
          <span className="rating">5.0</span>
          <span className="rating-label">Excellent</span>
          <span className="reviews-count">2,064 reviews</span>
        </div>
        <div className="ranking"> #1 of 45 hotels in Cox's Bazar</div>
        {/* Additional rating details */}
        <p className="hotel-description">
          After fifty years of glorious past, Sayeman Beach Resort revives its famed legacy of comfort...
          {/* Truncated for brevity */}
        </p>
        {/* Toggle for read more or read less */}
      </div>
      <div className="amenities-section">
        <h2>Property amenities</h2>
        {/* List of amenities */}
      </div>
    </div>
    </div>

);
}
    

