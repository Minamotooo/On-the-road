import React, { useEffect, useState } from "react";
import { API, Modal, postJSON } from "../Shared/ui";

export default function EditRoomModal({ hotelId, roomType, onClose, onEdit }) {
  const [availableRooms, setAvailableRooms] = useState("");
  const [amenities, setAmenities] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [roomImageURL, setRoomImageURL] = useState("");

  useEffect(() => {
    async function fetchHotelRoomInfo() {
      if (!hotelId) return;
      try {
        const response = await postJSON(`${API}/hotel/fetchCurrentRoomInfo/${hotelId}`, {
          hotelId,
          roomType,
        });
        if (!response.ok) throw new Error(response.statusText);
        const [room] = await response.json();
        if (!room) return;
        setAmenities(room.amenities || "");
        setAvailableRooms(room.available_rooms_left);
        setPricePerNight(Number(room.price_per_night));
        setNumberOfGuests(room.capacity);
        setRoomImageURL(room.image || "");
      } catch (error) {
        console.error("Error fetching room info:", error);
      }
    }
    fetchHotelRoomInfo();
  }, [hotelId, roomType]);

  const handleSave = (event) => {
    event.preventDefault();
    onEdit({
      roomType,
      hotelId,
      availableRooms,
      amenities,
      pricePerNight,
      numberOfGuests,
      roomImageURL,
    });
  };

  return (
    <Modal kicker={roomType} title="Edit room" onClose={onClose}>
      <form className="otr-form" onSubmit={handleSave}>
        <label>Available rooms</label>
        <input type="number" min="0" value={availableRooms} onChange={(e) => setAvailableRooms(e.target.value)} />
        <label>Guests per room</label>
        <input type="number" min="1" value={numberOfGuests} onChange={(e) => setNumberOfGuests(e.target.value)} />
        <label>Price per night (৳)</label>
        <input type="number" min="1" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} />
        <label>Amenities</label>
        <input value={amenities} onChange={(e) => setAmenities(e.target.value)} />
        <label>Room photo link</label>
        <input value={roomImageURL} onChange={(e) => setRoomImageURL(e.target.value)} />
        <div>
          <button type="submit" className="otr-btn">
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
