// // ReservationModal.jsx
// import React, { useState } from "react";
// import Modal from "react-modal";
// import { useAuth } from "../../AuthContext";

// const ReservationModal = ({ isOpen, onClose, onReserve }) => {
//   const { user } = useAuth();
//   const [noOfRooms, setNoOfRooms] = useState(1);
//   const [checkInDate, setCheckInDate] = useState("");
//   const [checkOutDate, setCheckOutDate] = useState("");

//   const handleReserve = () => {
//     // Validate the form data here before calling onReserve
//     // You can add more validation as needed

//     onReserve({
//       username: user.username,

//       noOfRooms,
//       checkInDate,
//       checkOutDate,
//     });

//     // Close the modal after reservation
//     onClose();
//   };

//   return (
//     <Modal isOpen={isOpen} onRequestClose={onClose}>
//       <h2>Reservation Details</h2>
//       <label>
//         Number of Rooms:
//         <input
//           type="number"
//           value={noOfRooms}
//           onChange={(e) => setNoOfRooms(e.target.value)}
//         />
//       </label>
//       <label>
//         Check-In Date:
//         <input
//           type="date"
//           value={checkInDate}
//           onChange={(e) => setCheckInDate(e.target.value)}
//         />
//       </label>
//       <label>
//         Check-Out Date:
//         <input
//           type="date"
//           value={checkOutDate}
//           onChange={(e) => setCheckOutDate(e.target.value)}
//         />
//       </label>
//       <button onClick={handleReserve}>Reserve</button>
//     </Modal>
//   );
// };

// export default ReservationModal;

import React, { useState } from "react";
import Modal from "react-modal";
import { useAuth } from "../../AuthContext";

const ReservationModal = ({ isOpen, onClose, onReserve }) => {
  const { user } = useAuth();
  const [noOfRooms, setNoOfRooms] = useState(1);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message

  const handleReserve = () => {
    // Validate the form data here before calling onReserve
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      // Display an error message
      setErrorMessage("Check-out date must be later than check-in date");
      return;
    }

    // Reset the error message
    setErrorMessage("");

    // You can add more validation as needed

    onReserve({
      username: user.username,
      noOfRooms,
      checkInDate,
      checkOutDate,
    });

    // Close the modal after reservation
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>Reservation Details</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <label>
        Number of Rooms:
        <input
          type="number"
          value={noOfRooms}
          onChange={(e) => setNoOfRooms(e.target.value)}
        />
      </label>
      <label>
        Check-In Date:
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
      </label>
      <label>
        Check-Out Date:
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
      </label>
      <button onClick={handleReserve}>Reserve</button>
    </Modal>
  );
};

export default ReservationModal;
