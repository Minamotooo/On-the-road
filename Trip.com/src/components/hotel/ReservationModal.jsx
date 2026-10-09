import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import { Modal, taka } from "../Shared/ui";

const isoDate = (date) => date.toISOString().slice(0, 10);

const ReservationModal = ({ onClose, onReserve, availableRooms, roomType, pricePerNight }) => {
  const { user } = useAuth();
  const today = new Date();
  const [noOfRooms, setNoOfRooms] = useState(1);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const nights =
    checkInDate && checkOutDate
      ? Math.round((new Date(checkOutDate) - new Date(checkInDate)) / 86400000)
      : 0;

  const handleReserve = (event) => {
    event.preventDefault();
    if (!checkInDate || !checkOutDate) {
      setErrorMessage("Please enter both check-in and check-out dates");
      return;
    }
    if (nights <= 0) {
      setErrorMessage("Check-out date must be later than check-in date");
      return;
    }
    if (noOfRooms > availableRooms) {
      setErrorMessage("Number of rooms exceeds the available rooms");
      return;
    }
    if (noOfRooms <= 0) {
      setErrorMessage("Number of rooms must be greater than 0");
      return;
    }
    setErrorMessage("");
    onReserve({ username: user.username, noOfRooms, checkInDate, checkOutDate });
  };

  return (
    <Modal kicker={roomType} title="Reservation details" onClose={onClose}>
      <form className="otr-form" onSubmit={handleReserve}>
        <label>Number of rooms</label>
        <input
          type="number"
          min="1"
          max={availableRooms}
          value={noOfRooms}
          onChange={(e) => setNoOfRooms(Number(e.target.value))}
        />
        <label>Check-in</label>
        <input
          type="date"
          min={isoDate(today)}
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
        <label>Check-out</label>
        <input
          type="date"
          min={checkInDate || isoDate(today)}
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
        {nights > 0 && (
          <p className="otr-muted" style={{ fontFamily: "Jost, sans-serif", margin: "4px 0" }}>
            {nights} night{nights > 1 ? "s" : ""} × {noOfRooms} room{noOfRooms > 1 ? "s" : ""} ={" "}
            <b style={{ color: "#112b3c" }}>{taka(nights * noOfRooms * pricePerNight)}</b>
          </p>
        )}
        {errorMessage && <span className="otr-note">{errorMessage}</span>}
        <div>
          <button type="submit" className="otr-btn">
            Send request
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReservationModal;
