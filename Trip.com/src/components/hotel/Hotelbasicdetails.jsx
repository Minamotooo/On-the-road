import React from "react";
import "../hotelside/hotel.css";

export default function Hotelbasicdetails(props) {
  const data = props.data;
  console.log(props.data);
  return (
    <div className="hotel-header">
      <div>
        <h1> {data.name}</h1>
        <div className="hotel-rating"></div>
      </div>
      {/* Icons can be added as needed */}

      <div className="hotel-overview">
        <div className="about-section">
          <h2>Location: </h2>
          <p>{data.address}</p>
          <h2>About</h2>

          {/* Additional rating details */}
          <p className="hotel-description">
            {data.description}
            {/* Truncated for brevity */}
          </p>
          <h2>Contact us:</h2>
          <p>Phone: {data.phone_no}</p>
          <p>Email: {data.email}</p>
          {/* Toggle for read more or read less */}
        </div>
      </div>
    </div>
  );
}
