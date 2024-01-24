import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Details() {
  const { spot_id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/touristSpotInfo/Details/${spot_id}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          setError(`Error fetching data: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [spot_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData || userData.length === 0) {
    return <div>No data found</div>;
  }

  return (
    <div>
      <h1>{userData[0].name}</h1>
      <p>{userData[0].blog_description}</p>
      <ul>
        {userData.map((item, index) => (
          <li key={index}>{item.upazilla}</li>
        ))}
      </ul>
    </div>
  );
}
