import React, { useState } from "react";
import { Modal } from "../Shared/ui";

export default function AddRoomModal({ hotelId, onClose, onAdd }) {
  const [roomType, setRoomType] = useState("");
  const [availableRooms, setAvailableRooms] = useState("");
  const [amenities, setAmenities] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [roomImageURL, setRoomImageURL] = useState("");
  const [error, setError] = useState("");

  const handleSave = (event) => {
    event.preventDefault();
    if (!roomType.trim() || !availableRooms || !pricePerNight || !numberOfGuests) {
      setError("Room type, rooms, guests and price are required.");
      return;
    }
    onAdd({
      hotelId,
      roomType: roomType.trim(),
      availableRooms,
      amenities,
      pricePerNight,
      numberOfGuests,
      roomImageURL: roomImageURL.trim() || null,
    });
  };

  return (
    <Modal kicker="New room" title="Add a room" onClose={onClose}>
      <form className="otr-form" onSubmit={handleSave}>
        <label>Room type</label>
        <input value={roomType} placeholder="e.g. Deluxe Sea View" onChange={(e) => setRoomType(e.target.value)} />
        <label>Available rooms</label>
        <input type="number" min="0" value={availableRooms} onChange={(e) => setAvailableRooms(e.target.value)} />
        <label>Guests per room</label>
        <input type="number" min="1" value={numberOfGuests} onChange={(e) => setNumberOfGuests(e.target.value)} />
        <label>Price per night (৳)</label>
        <input type="number" min="1" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} />
        <label>Amenities</label>
        <input value={amenities} placeholder="Wi-Fi, TV, Balcony" onChange={(e) => setAmenities(e.target.value)} />
        <label>Room photo link</label>
        <input value={roomImageURL} placeholder="https://…" onChange={(e) => setRoomImageURL(e.target.value)} />
        {error && <span className="otr-note">{error}</span>}
        <div>
          <button type="submit" className="otr-btn">
            Save room
          </button>
        </div>
      </form>
    </Modal>
  );
}
