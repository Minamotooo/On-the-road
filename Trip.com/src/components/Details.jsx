import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Details() {
  const { spot_id } = useParams();
  const [spotData, setSpotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTouristSpotData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/touristSpotInfo/Details/${spot_id}`,
          {
            method: "POST", // Specify the method as POST
            headers: {
              "Content-Type": "application/json",
            },
            // Since you are not sending a body, the body property is not required
          }
        );
        if (!response.ok) {
          throw new Error(Error`fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        setSpotData(data);
      } catch (error) {
        setError(Error`fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTouristSpotData();
  }, [spot_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!spotData || spotData.length === 0) {
    return <div>No data found</div>;
  }

  return (
    <div>
      <h1>hello</h1>
    </div>
  );
}
