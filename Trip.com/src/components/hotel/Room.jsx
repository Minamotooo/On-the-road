import React from "react";
import sampleHotelRoomPhoto from "../images/samplehotelroom.jpg";

export default function Room(props) {
  const data = props.data;
  return (
    <div className="room-selection">
      <div className="room-details">
        <div className="room-images">
          <img src={sampleHotelRoomPhoto} alt="Room" />
          {/* Additional thumbnails */}
        </div>
        <div className="room-info">
          <h3>{data.room_type}</h3>
          <p>Available Rooms: {data.available_rooms_left}</p>
          <p>Amenities: {data.amenities}</p>
        </div>
      </div>
      <div className="room-choices">
        <div className="price-box">
          <span>Today's best price</span>
          <div className="price">${data.price_per_night}</div>
          <button>Reserve</button>
        </div>
        <div className="price-inclusions">
          {/* List any inclusions like breakfast */}
        </div>
      </div>
    </div>
  );
}
