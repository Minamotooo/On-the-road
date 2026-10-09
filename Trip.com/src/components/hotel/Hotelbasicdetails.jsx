import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import HotelProfileEdit from "../hotelside/HotelProfileEdit";
import defaultphoto from "../images/hotel-photo.jpg";
import { API, PageHero, Stars, placeName, postJSON, taka } from "../Shared/ui";
import AddRoomModal from "./AddRoomModal";

// The hotel's hero: photo in the arch, name, location and the owner's tools
export default function Hotelbasicdetails({ data, hotelId, reviewCount, fromPrice, roomPhoto, onChanged }) {
  const [showEdit, setShowEdit] = useState(false);
  const [isAddRoomModalOpen, setAddRoomModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isOwner = user && user.username === data.username && user.role === "hotel";

  const handleAddRoom = async (newRoomData) => {
    try {
      const response = await postJSON(`${API}/hotel/insertNewRoom`, {
        roomType: newRoomData.roomType,
        hotelID: hotelId,
        availableRooms: newRoomData.availableRooms,
        amenities: newRoomData.amenities,
        pricePerNight: newRoomData.pricePerNight,
        numberOfGuests: newRoomData.numberOfGuests,
        roomImageURL: newRoomData.roomImageURL,
      });
      if (!response.ok) {
        console.error("Error adding room:", response.statusText);
        return;
      }
      setAddRoomModalOpen(false);
      onChanged && onChanged();
    } catch (error) {
      console.error("Error adding room:", error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this hotel and all of its rooms and bookings?")) return;
    try {
      const response = await fetch(`${API}/hotel/delete/${user.username}`, { method: "DELETE" });
      if (response.ok) {
        logout();
        navigate("/");
      } else {
        console.log(`Error deleting hotel: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`Error deleting hotel: ${error.message}`);
    }
  };

  const rating = Number(data.average_rating);

  return (
    <>
      <PageHero
        kicker={`${placeName(data.district_name)}, ${data.division_name}`}
        title={data.name}
        sub={data.description}
        arch={data.photo || defaultphoto}
        pill={roomPhoto}
      >
        <div className="otr-facts">
          <div>
            <span className="otr-facts__label">Guest rating</span>
            {rating > 0 ? (
              <>
                <Stars value={rating} /> {rating.toFixed(1)} ({reviewCount})
              </>
            ) : (
              "New"
            )}
          </div>
          {fromPrice && (
            <div>
              <span className="otr-facts__label">Rooms from</span>
              {taka(fromPrice)} / night
            </div>
          )}
          <div>
            <span className="otr-facts__label">Address</span>
            {data.address}
          </div>
          <div>
            <span className="otr-facts__label">Contact</span>
            {data.phone_no} · {data.email}
          </div>
        </div>

        {isOwner && (
          <div className="otr-chips">
            <button className="otr-btn" onClick={() => setAddRoomModalOpen(true)}>
              Add room
            </button>
            <button className="otr-btn otr-btn--ghost" onClick={() => setShowEdit(true)}>
              Edit hotel profile
            </button>
            <button className="otr-btn otr-btn--ghost" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </PageHero>

      {isAddRoomModalOpen && (
        <AddRoomModal
          isOpen={isAddRoomModalOpen}
          onClose={() => setAddRoomModalOpen(false)}
          onAdd={handleAddRoom}
          hotelId={hotelId}
        />
      )}
      {showEdit && (
        <HotelProfileEdit
          onClose={() => {
            setShowEdit(false);
            onChanged && onChanged();
          }}
        />
      )}
    </>
  );
}
