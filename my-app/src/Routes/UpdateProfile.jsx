// UpdateProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/user/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          // Set the initial value for the form
          setUpdatedPhoneNumber(data.phone_no || ''); // Set to an empty string if phone_no is null
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

  const handleChange = (e) => {
    setUpdatedPhoneNumber(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:4000/update/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_no: updatedPhoneNumber }),
      });

      if (response.ok) {
        console.log('Phone number updated successfully');
        navigate(`/user/${username}`);
      } else {
        const errorMessage = await response.text();
        setError(`Error updating phone number: ${errorMessage || response.statusText}`);
      }
    } catch (error) {
      setError(`Error updating phone number: ${error.message}`);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div>
      <h2>Update Phone Number</h2>
      <form>
        <label>
          Phone Number:
          <input
            type="text"
            value={updatedPhoneNumber}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="button" onClick={handleUpdate}>
          Update
        </button>
      </form>
    </div>
 );
};

export default UpdateProfile;
