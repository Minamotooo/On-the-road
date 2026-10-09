import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API, Modal, postJSON } from "../Shared/ui";

export default function HotelProfileEdit({ onClose }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [hotelId, setHotelId] = useState(null);
  const [error, setError] = useState("");

  const { username } = useParams();

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const responseHotelId = await postJSON(`${API}/hotel/fetchHotelId/${username}`, { username });
        if (!responseHotelId.ok) throw new Error("Error fetching hotelId");
        const { hotelId: id } = await responseHotelId.json();
        setHotelId(id);

        const response = await postJSON(`${API}/hotel/details/${id}`, { hotelId: id });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setEmail(data.email || "");
        setName(data.name || "");
        setProfilePhoto(data.photo || "");
        setPhoneNumber(data.phone_no || "");
        setDescription(data.description || "");
      } catch (err) {
        console.log("Error fetching hotel data: ", err.message);
      }
    };
    fetchHotelData();
  }, [username]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await postJSON(
        `${API}/hotel/update/${hotelId}`,
        { email, name, phone_no: phoneNumber, photo: profilePhoto, description },
        "PUT"
      );
      if (!response.ok) throw new Error(response.statusText);
      onClose();
    } catch (err) {
      setError(`Could not update the profile: ${err.message}`);
    }
  };

  return (
    <Modal kicker="Your hotel" title="Edit hotel profile" onClose={onClose}>
      <form className="otr-form" onSubmit={handleUpdate}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Phone number</label>
        <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <label>Photo link</label>
        <input value={profilePhoto} onChange={(e) => setProfilePhoto(e.target.value)} />
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        {error && <span className="otr-note">{error}</span>}
        <div>
          <button type="submit" className="otr-btn">
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
}
