import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Navbar from "../HomePage/Navbar";
import "../Signin&up/in&up.css"; // Import the CSS file for styling
import "./Dashboard.css"; // Import the UserProfile.css
import EditProfile from "./EditProfile"; // Import the EditProfile component

export default function Dashboard() {
  const navigate = useNavigate();
  // const { user } = useAuth();

  //console.log("Username:", user);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [pendingHotelBookings, setPendingHotelRequests] = useState(null);
  const [approvedHotelBookings, setApprovedHotelRequests] = useState(null);

  const { user, logout } = useAuth(); // Access user information using the useAuth hook
  const username = user.username;
  // In handleDeleteClick function
  const handleDeleteClick = async () => {
    try {
      console.log("Deleting user:", user.username);

      const response = await fetch(
        `http://localhost:4000/signin/user/${user.username}`,
        {
          method: "DELETE",
        }
      );

      console.log("Response from server:", response);

      if (response.ok) {
        navigate("/");
        logout();
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
        if (!username) {
          // Username is not available, return or handle accordingly
          return;
        }

        const response = await fetch(
          `http://localhost:4000/signin/user/${user.username}`
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
  }, [user.username]);

  useEffect(() => {
    const fetchPendingData = async () => {
      try {
        if (!username) {
          // Username is not available, return or handle accordingly
          return;
        }

        const response = await fetch(
          `http://localhost:4000/hotel/fetchPendingRequests/${user.username}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPendingHotelRequests(data);
        } else {
          setError(`Error fetching user data: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Error fetching user data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingData();
  }, [user.username]);

  useEffect(() => {
    const fetchApprovedData = async () => {
      try {
        if (!username) {
          // Username is not available, return or handle accordingly
          return;
        }

        //console.log("Fetching approved requests for:", username);
        const response = await fetch(
          `http://localhost:4000/hotel/fetchApprovedRequests/${user.username}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setApprovedHotelRequests(data);
        } else {
          setError(`Error fetching user data: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Error fetching user data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedData();
  }, [user.username]);

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
              {/* <img src={userData.profile_photo} className="pp" /> */}
              <img
                src={
                  userData?.profile_photo ||
                  "https://static.thenounproject.com/png/5034901-200.pngl"
                }
                className="pp"
              />
            </div>

            <h3 className="heading">{userData?.username || "Loading User"}</h3>
          </div>
          <div className="info">
            <p>
              Full Name: {userData?.first_name} {userData?.last_name}
            </p>
            <p>Email : {userData?.email} </p>
            <p>Date of Birth: {userData?.date_of_birth}</p>
            <p>Phone Number: {userData?.phone_no}</p>
            <p>
              Address: {userData?.house_no}, {userData?.road_no},{" "}
              {userData?.road_name}, {userData?.district}, {userData?.division}-
              {userData?.zip_code}
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
          <div className="booking-segment">
            <h2>Pending Booking Requests</h2>
            <div className="booking-list scrollable-container">
              {pendingHotelBookings && pendingHotelBookings.length > 0 ? (
                pendingHotelBookings.map((booking, index) => (
                  <div key={index} className="booking-request">
                    <p>Hotel: {booking.name}</p>
                    <p>Room Type: {booking.room_type}</p>
                    <p>No. of Rooms: {booking.no_of_rooms}</p>
                    <p>Check-in Date: {booking.check_in_date}</p>
                    <p>Check-out Date: {booking.check_out_date}</p>
                    <p>Total Bill: {booking.total_bill}</p>
                  </div>
                ))
              ) : (
                <p>No pending booking requests</p>
              )}
            </div>
          </div>

          <div className="booking-segment">
            <h2>Completed Booking Requests</h2>
            <div className="booking-list scrollable-container">
              {approvedHotelBookings && approvedHotelBookings.length > 0 ? (
                approvedHotelBookings.map((booking, index) => (
                  <div key={index} className="booking-request">
                    <p>Hotel: {booking.name}</p>
                    <p>Room Type: {booking.room_type}</p>
                    <p>No. of Rooms: {booking.no_of_rooms}</p>
                    <p>Check-in Date: {booking.check_in_date}</p>
                    <p>Check-out Date: {booking.check_out_date}</p>
                    <p>Total Bill: {booking.total_bill}</p>
                  </div>
                ))
              ) : (
                <p>No completed booking requests</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {showEditProfile && <EditProfile onClose={onClose} />}
    </div>
  );
}
