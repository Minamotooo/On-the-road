// UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UserProfile.css'; // Import the UserProfile.css file

const UserProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDeleteClick = async () => {
    try {
      const response = await fetch(`http://localhost:4000/user/${username}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // User deleted successfully, navigate to the sign-in page
        navigate('/signin'); // Replace '/signin' with the actual path to your sign-in page
      } else {
        setError(`Error deleting user: ${response.statusText}`);
      }
    } catch (error) {
      setError(`Error deleting user: ${error.message}`);
    }
  };

  const handleUpdateClick = () => {
    navigate(`/update/${username}`);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/user/${username}`);
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
    <div className="container">
      <h2 className="heading">User Profile</h2>
      <div className="profile-info">
        <p>
          <strong>Username:</strong> {userData.username}<br />
          <strong>Email:</strong> {userData.email}<br />
          <strong>First Name:</strong> {userData.first_name}<br />
          <strong>Last Name:</strong> {userData.last_name}<br />
          <strong>Phone Number:</strong> {userData.phone_no}<br />
        </p>
      </div>
      <button className="button update-button" onClick={handleUpdateClick}>Update Data</button>
      <button className="button" onClick={handleDeleteClick}>Delete</button>
    </div>
  );
};

export default UserProfile;
