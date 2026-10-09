import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import sampleHotelRoomPhoto from "../images/samplehotelroom.jpg";
import { API, postJSON, taka } from "../Shared/ui";
import EditRoomModal from "./EditRoomModal";
import ReservationModal from "./ReservationModal";

export default function Room({ data, hotelID, isOwner, onChanged }) {
  const { user } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [note, setNote] = useState("");

  const handleReserve = async (reservationData) => {
    try {
      const response = await postJSON(`${API}/hotel/Roombooking/${hotelID}`, {
        username: user.username,
        roomType: data.room_type,
        pricePerNight: Number(data.price_per_night),
        noOfRooms: Number(reservationData.noOfRooms),
        checkInDate: reservationData.checkInDate,
        checkOutDate: reservationData.checkOutDate,
      });
      if (!response.ok) throw new Error(response.statusText);
      setNote("Request sent! The hotel will confirm it soon.");
    } catch (error) {
      console.error("Error making reservation:", error.message);
      setNote("Could not send the request, please try again.");
    }
    setModalOpen(false);
  };

  const handleRoomEdit = async (editedData) => {
    try {
      const response = await postJSON(
        `${API}/hotel/editRoom/${hotelID}`,
        {
          roomType: data.room_type,
          hotelID,
          availableRooms: editedData.availableRooms,
          amenities: editedData.amenities,
          pricePerNight: editedData.pricePerNight,
          numberOfGuests: editedData.numberOfGuests,
          roomImageURL: editedData.roomImageURL,
        },
        "PUT"
      );
      if (!response.ok) {
        console.error("Error updating room information:", response.statusText);
        return;
      }
      onChanged && onChanged();
    } catch (error) {
      console.error("Error updating room information:", error.message);
    }
    setEditModalOpen(false);
  };

  const amenities = (data.amenities || "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  const soldOut = Number(data.available_rooms_left) === 0;

  return (
    <div className="otr-room">
      <img src={data.image ? data.image : sampleHotelRoomPhoto} alt={data.room_type} />
      <div className="otr-room__info">
        <h3>{data.room_type}</h3>
        <p>
          Sleeps {data.capacity} · {soldOut ? "Sold out" : `${data.available_rooms_left} rooms left`}
        </p>
        <div style={{ marginTop: 10 }}>
          {amenities.map((a) => (
            <span key={a} className="otr-tag">
              {a}
            </span>
          ))}
        </div>
        {note && <p className="otr-note">{note}</p>}
      </div>
      <div className="otr-room__price">
        <small>Tonight's best price</small>
        <strong>{taka(data.price_per_night)}</strong>
        <small>per night</small>
        {user && user.role === "client" && (
          <button className="otr-btn" disabled={soldOut} onClick={() => setModalOpen(true)}>
            Reserve
          </button>
        )}
        {!user && <small>Log in as a traveller to reserve</small>}
        {isOwner && (
          <button className="otr-btn otr-btn--ghost" onClick={() => setEditModalOpen(true)}>
            Edit room
          </button>
        )}
      </div>

      {isModalOpen && (
        <ReservationModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onReserve={handleReserve}
          availableRooms={Number(data.available_rooms_left)}
          roomType={data.room_type}
          pricePerNight={Number(data.price_per_night)}
        />
      )}

      {editModalOpen && (
        <EditRoomModal
          hotelId={hotelID}
          roomType={data.room_type}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onEdit={handleRoomEdit}
        />
      )}
    </div>
  );
}
