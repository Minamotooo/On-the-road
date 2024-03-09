import React, { useEffect, useState } from "react";
import Modal from "react-modal";

export default function EditRoomModal({
  hotelId,
  roomType,
  isOpen,
  onClose,
  onEdit,
}) {
  const [availableRooms, setAvailableRooms] = useState("");
  const [amenities, setAmenities] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [roomImageURL, setRoomImageURL] = useState("");

  //console.log("HotelId from EditRoomModal:", hotelId);
  //console.log("Room_Type from EditRoomModal:", roomType);

  useEffect(() => {
    async function fetchHotelRoomInfo() {
      try {
        if (!hotelId) {
          console.error("Invalid hotelId");
          return;
        }

        const response = await fetch(
          `http://localhost:4000/hotel/fetchCurrentRoomInfo/${hotelId}`, // Use backticks for template literals
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ hotelId, roomType }), // Assuming your backend needs the hotelId in the body
          }
        );

        if (!response.ok) {
          console.error("Error fetching hotels:", response.statusText);
        }

        const data = await response.json();
        setAmenities(data.amenities);
        setAvailableRooms(data.available_rooms_left);
        setPricePerNight(data.price_per_night);
        setNumberOfGuests(data.capcity);
        setRoomImageURL(data.image);

        console.log("Room Info:", data);
        console.log("Amenities:", amenities);
        console.log("Available Rooms:", availableRooms);
        console.log("Price Per Night:", pricePerNight);
        console.log("Number of Guests:", numberOfGuests);
        console.log("Room Image URL:", roomImageURL);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    }

    {
      // Check if hotelId is not null or undefined
      fetchHotelRoomInfo();
    }
  }, [hotelId, roomType]);

  const handleSave = () => {
    onEdit({
      roomType,
      hotelId,
      availableRooms,
      amenities,
      pricePerNight,
      numberOfGuests,
      roomImageURL,
      // Include other edited information here
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Room Modal"
    >
      <div className="modal-content">
        {/* Text fields for editing information */}
        <h4>Number of Available Rooms:</h4>
        <input
          value={availableRooms}
          type="text"
          placeholder="Available Rooms"
          onChange={(e) => setAvailableRooms(e.target.value)}
        />
        <h4>Amenities:</h4>
        <input
          type="text"
          placeholder={amenities}
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
        />
        <h4>Number of guests:</h4>
        <input
          type="text"
          placeholder={numberOfGuests}
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(e.target.value)}
        />
        <h4>Price Per Night:</h4>
        <input
          type="text"
          placeholder={pricePerNight}
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
        />
        {/* Add other text fields for editing information */}
        <h4>Room Image URL:</h4>
        <input
          type="text"
          placeholder={roomImageURL}
          value={roomImageURL}
          onChange={(e) => setRoomImageURL(e.target.value)}
        />
        <h4></h4>
        <button className="button--style" onClick={handleSave}>
          Save
        </button>
        <button className="button--style" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
