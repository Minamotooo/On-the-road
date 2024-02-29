import React, { useEffect, useState } from "react";
import { useNavigate, useRevalidator } from "react-router-dom";
import Navbar from "../HomePage/Navbar";
import "./Dashboard.css"; // Import the UserProfile.css
import { useParams } from "react-router-dom";
import "../Signin&up/in&up.css"; // Import the CSS file for styling
import EditProfile from "./EditProfile";

export default function Dashboard() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // In handleDeleteClick function
  const handleDeleteClick = async () => {
    try {
      console.log("Deleting user:", username);

      const response = await fetch(
        `http://localhost:4000/signin/user/${username}`,
        {
          method: "DELETE",
        }
      );

      console.log("Response from server:", response);

      if (response.ok) {
        navigate("/");
      } else {
        setError(`Error deleting user: ${response.statusText}`);
      }
    } catch (error) {
      setError(`Error deleting user: ${error.message}`);
    }
  };

  const handleUpdateClick = () => {
    setShowEditProfile(true);
  };

  const onClose = () => {
    setShowEditProfile(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/signin/user/${username}`
        );
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          setError(`Error fetching user data: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Error fetching user data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="flexbox">
        <div className="container">
          <h1>User Dashboard</h1>
          <div className="profile-info">
            <div className="pp-container">
              <img src={userData.profile_photo} className="pp" />
            </div>

            <h3 className="heading">{userData.username}</h3>
          </div>
          <div className="info">
            <p>
              Full Name: {userData.first_name} {userData.last_name}
            </p>
            <p>Email : {userData.email} </p>
            <p>Date of Birth: {userData.date_of_birth}</p>
            <p>Phone Number: {userData.phone_no}</p>
            <p>
              Address: {userData.house_no}, {userData.road_no},{" "}
              {userData.road_name}, {userData.district}, {userData.division}-
              {userData.zip_code}
            </p>
          </div>
          <br />
          <button className="button--style" onClick={handleUpdateClick}>
            EDIT PROFILE
          </button>
          <button className="button--style" onClick={handleDeleteClick}>
            DELETE
          </button>
        </div>

        <div className="container">
          <h1>Booking History</h1>
        </div>
      </div>
      {showEditProfile && <EditProfile onClose={onClose} />}
    </div>
  );
}
