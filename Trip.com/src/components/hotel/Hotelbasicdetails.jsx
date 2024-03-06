import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "../Signin&up/in&up.css";
import HotelProfileEdit from "../hotelside/HotelProfileEdit";
import "../hotelside/hotel.css";

export default function Hotelbasicdetails(props) {
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate();
  const { username } = useParams();

  const handleUpdate = () => {
    setShowEdit(true);
  };
  const { user, logout } = useAuth(); // Access user information using the useAuth hook
  // console.log("User:", user.username, user.role);
  // In handleDeleteClick function
  const handleDelete = async () => {
    try {
      console.log("Deleting user:", user.username);

      const response = await fetch(
        `http://localhost:4000/hotel/delete/${user.username}`,
        {
          method: "DELETE",
        }
      );

      console.log("Response from server:", response);

      if (response.ok) {
        navigate("/");
        logout();
      } else {
        console.log(`Error deleting user: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`Error deleting user: ${error.message}`);
    }
  };

  const onClose = () => setShowEdit(false);
  const data = props.data;
  //console.log(props.data);
  return (
    <div className="hotel-header">
      <div>
        <h1> {data.name}</h1>
        <div className="hotel-rating"></div>
      </div>
      {/* Icons can be added as needed */}

      <div className="hotel-overview">
        <div className="about-section">
          <h2>Location: </h2>
          <p>{data.address}</p>
          <h2>About</h2>

          {/* Additional rating details */}
          <p className="hotel-description">
            {data.description}
            {/* Truncated for brevity */}
          </p>
          <h2>Contact us:</h2>
          <p>Phone: {data.phone_no}</p>
          <p>Email: {data.email}</p>
        </div>
        {user && user.username === data.username && user.role === "hotel" && (
          <div>
            <button className="button--style" onClick={handleUpdate}>
              Edit Hotel Profile
            </button>
            <button className="button--style" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
      {showEdit && <HotelProfileEdit onClose={onClose} />}
    </div>
  );
}
