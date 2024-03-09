import React from "react";
import star from "../images/star.png";
import "./page.css";

/*
Challenge: Build the Card component
For now, hard-code in the data (like 
the rating, title, price, etc.)

Notes:
- Only render 1 instance (I already did this for you)
- The star icon and photo (katie-zaferes.png) are in the images 
  folder for your use
- Make sure to include:
    - image
    - star icon (star.png), rating, and review count
    - title
    - cost/person
- The main purpose of this challenge is to show you where our limitations
  currently are, so don't worry about the fact that you're hard-coding all
  this data into the component.
*/

export default function Card(props) {
  console.log(props.reviewCount);
  return (
    <div className="card">
      <img src={`${props.image}`} className="card--image" alt="poster" />

      <h3 className="card--title">{props.title}</h3>
      <div className="card--stats">
        <img src={star} className="card--star" alt="star" />
        <span className="details">
          <span>{props.rating}</span>
          <span className="gray">({props.reviewCount}) • </span>
          <span className="gray">{props.location}</span>
        </span>
      </div>

      <p className="card--description">{props.description}</p>
    </div>
  );
}
