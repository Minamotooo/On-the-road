import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import sampleHotelRoomPhoto from "../images/samplehotelroom.jpg";
import ReservationModal from "./ReservationModal";

export default function Room(props) {
  var { user } = useAuth();
  user = { username: "user1", role: "client" };
  const data = props.data;

  const [isModalOpen, setModalOpen] = useState(false);

  const handleReserve = (reservationData) => {
    // You can log or process the reservationData here before sending it to the backend
    console.log("Reservation Data:", reservationData);

    // Send reservationData to the backend
    // You need to implement the backend communication logic here
    // Use fetch or any other HTTP client library to make a POST request

    // Close the modal after handling the reservation
    setModalOpen(false);
  };

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
          {user && user.role === "client" && (
            <button onClick={handleReserve}>Reserve</button>
          )}
        </div>
        <div className="price-inclusions">
          {/* List any inclusions like breakfast */}
        </div>
      </div>
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onReserve={handleReserve}
      />
    </div>
  );
}
