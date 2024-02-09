import React from "react"
import {ReactDOM} from "react-dom/client"
import "../HomePage/page.css"
import defaultphoto from "../images/hotel-photo.jpg"

const HotelCard = (props) => {
  const data = props.data;
  return (
    <div className="card">
    <img
src={defaultphoto}
className="card--image"
alt="poster"
/>
    
    <h3 className="card--title">{data.name}</h3>
    <div className="card--stats">
        <span className="details">
        <span>{data.adress}</span>
        <span className="gray">{data.district}, </span>
        <span className="gray">{data.division}</span>
        </span>
    </div>
    
    <p className="card--description">{data.description}</p>
</div>
    
  );
};

export default HotelCard;
