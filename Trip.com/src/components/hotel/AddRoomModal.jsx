import React, { useEffect, useState } from "react";
import Modal from "react-modal";

export default function AddRoomModal({ hotelId, isOpen, onClose, onAdd }) {
  const [roomType, setRoomType] = useState("");
  const [availableRooms, setAvailableRooms] = useState("");
  const [amenities, setAmenities] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [roomImageURL, setRoomImageURL] = useState("");

  useEffect(() => {
    // You can perform any additional initialization here
    // For example, reset state values when the modal opens
    setRoomType("");
    setAvailableRooms("");
    setAmenities("");
    setPricePerNight("");
    setNumberOfGuests("");
    setRoomImageURL("");
  }, [isOpen]);

  const handleSave = () => {
    onAdd({
      hotelId,
      roomType,
      availableRooms,
      amenities,
      pricePerNight,
      numberOfGuests,
      roomImageURL,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Room Modal"
    >
      <div className="modal-content">
        {/* Text fields for adding information */}
        <h4>Room Type:</h4>
        <input
          type="text"
          placeholder="Room Type"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
        />
        <h4>Number of Available Rooms:</h4>
        <input
          type="text"
          placeholder="Available Rooms"
          value={availableRooms}
          onChange={(e) => setAvailableRooms(e.target.value)}
        />
        <h4>Amenities:</h4>
        <input
          type="text"
          placeholder="Amenities"
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
        />
        <h4>Number of guests:</h4>
        <input
          type="text"
          placeholder="Number of Guests"
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(e.target.value)}
        />
        <h4>Price Per Night:</h4>
        <input
          type="text"
          placeholder="Price Per Night"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
        />
        {/* Add other text fields for adding information */}
        <h4>Room Image URL:</h4>
        <input
          type="text"
          placeholder="Room Image URL"
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
