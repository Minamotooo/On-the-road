import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "../Signin&up/in&up.css";
import sampleHotelRoomPhoto from "../images/samplehotelroom.jpg";
import EditRoomModal from "./EditRoomModal";
import ReservationModal from "./ReservationModal";
import "./Room.css";

export default function Room(props) {
  let { hotelID } = props;
  const { username } = useParams();
  // console.log("HotelId from Room.jsx:", hotelID);
  // console.log("Username from Room.jsx:", username);
  const [fetchedHotelId, setFetchedHotelId] = useState(null);

  useEffect(() => {
    const fetchHotelId = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/hotel/fetchHotelId/${username}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
            }),
          }
        );

        if (!response.ok) {
          console.error("Error fetching hotelId:", response.statusText);
          // Handle the error, show a message to the user, or take appropriate action
          return;
        }

        const data = await response.json();
        console.log("Fetched Hotel ID:", data.hotelId);
        setFetchedHotelId(data.hotelId);
      } catch (error) {
        console.error("Error fetching hotelId:", error.message);
        // Handle the error, show a message to the user, or take appropriate action
      }
    };

    if (hotelID === null || hotelID === undefined) {
      fetchHotelId();
    }
  }, [hotelID, username]);

  //console.log("HotelId from Room.jsx:", hotelID);
  const { user } = useAuth();
  //user = { username: "user1", role: "client" };
  const data = props.data;

  const [isModalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [edititingRoom, setEditingRoom] = useState({});

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

  const openEditModal = (givenRoomType) => {
    console.log("Edit button clicked");
    console.log("Room Type:", givenRoomType);
    setEditingRoom(givenRoomType);
    setEditModalOpen(true);
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
        const hotelID = fetchedHotelId;

        const response = await fetch(
          `http://localhost:4000/hotel/Roombooking/${hotelID}`,
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

  const handleRoomEdit = async (editedData) => {
    try {
      //Send a POST request to update room information
      const hotelID = fetchedHotelId;
      const response = await fetch(
        `http://localhost:4000/hotel/editRoom/${hotelID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomType: editedData.roomType,
            hotelID: editedData.hotelId,
            availableRooms: editedData.availableRooms,
            amenities: editedData.amenities,
            pricePerNight: editedData.pricePerNight,
            numberOfGuests: editedData.numberOfGuests,
            roomImageURL: editedData.roomImageURL,
            // Include other required information
            //...editedData,
          }),
        }
      );
      if (!response.ok) {
        console.error("Error updating room information:", response.statusText);
        // Handle the error, show a message to the user, or take appropriate action
        return;
      }
      // Refresh the room details after updating
      // fetchHotelRooms();
    } catch (error) {
      console.error("Error updating room information:", error.message);
      // Handle the error, show a message to the user, or take appropriate action
    }
    setEditModalOpen(false);
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
          <p>Number of guests: {data.capacity}</p>
          {user && user.role === "hotel" && user.username === username && (
            <button
              className="button--style"
              onClick={() => openEditModal(data.room_type)}
            >
              Edit Room Information
            </button>
          )}
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

      <EditRoomModal
        hotelId={fetchedHotelId}
        roomType={edititingRoom}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onEdit={handleRoomEdit} // Define handleRoomEdit function
      />
    </div>
  );
}
