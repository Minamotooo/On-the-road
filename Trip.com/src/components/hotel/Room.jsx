import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "../Signin&up/in&up.css";
import sampleHotelRoomPhoto from "../images/samplehotelroom.jpg";
import ReservationModal from "./ReservationModal";
import "./Room.css";

export default function Room(props) {
  const { hotelId } = useParams();
  const { user } = useAuth();
  //user = { username: "user1", role: "client" };
  const data = props.data;

  const [isModalOpen, setModalOpen] = useState(false);
  const [room_type, setRoomType] = useState("");
  const [price_per_night, setPricePerNight] = useState(0);

  const openReserve = (input_room_type, input_price_per_night) => {
    console.log("Reserve button clicked");

    setPricePerNight(input_price_per_night);
    setRoomType(input_room_type);
    console.log("Room Type:", room_type);
    console.log("Price Per Night:", price_per_night);
    setModalOpen(true);
  };

  const handleReserve = (reservationData) => {
    // You can log or process the reservationData here before sending it to the backend
    //console.log("Reservation Data:", reservationData);

    const confirmBooking = async () => {
      try {
        console.log("Room Type:", room_type);
        console.log("Price Per Night:", price_per_night);
        console.log("noOfRooms: " + reservationData.noOfRooms);
        console.log("Checkin Date: " + reservationData.checkInDate);
        console.log("Checkout Date: " + reservationData.checkOutDate);

        const response = await fetch(
          `http://localhost:4000/hotel/Roombooking/${hotelId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: user.username,
              roomType: room_type,
              pricePerNight: price_per_night,
              noOfRooms: reservationData.noOfRooms,
              checkInDate: reservationData.checkInDate,
              checkOutDate: reservationData.checkOutDate,
            }),
          }
        );

        if (!response.ok) {
          console.error("Error making reservation:", response.statusText);
          // Handle the error, show a message to the user, or take appropriate action
          return;
        }

        const data = await response.json();
        console.log("Reservation successful:", data);

        // Optionally, you can perform additional actions after a successful reservation
        // For example, redirect to a confirmation page, update UI, etc.
      } catch (error) {
        console.error("Error making reservation:", error.message);
        // Handle the error, show a message to the user, or take appropriate action
      }
    };

    confirmBooking();

    // Close the modal after handling the reservation
    setModalOpen(false);
  };

  return (
    <div className="room-selection">
      <div className="room-details">
        <div className="room-images">
          <img src={data.image ? data.image : sampleHotelRoomPhoto} />

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
            <button
              className="button--style"
              onClick={() => openReserve(data.room_type, data.price_per_night)}
            >
              Reserve
            </button>
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
        availableRooms={data.available_rooms_left}
      />
    </div>
  );
}
