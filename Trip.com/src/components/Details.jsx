import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewCard from "./TouristSpot/touristSpotReviewCard";

export default function Details() {
  const { spot_id } = useParams();
  const [spotData, setSpotData] = useState({});
  const [spotReviews, setSpotReviews] = useState([]);
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
        setSpotData(data[0]);
      } catch (error) {
        setError(Error`fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchTouristSpotData();
  }, [spot_id]);

  useEffect(() => {
    const fetchTouristSpotReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/touristSpotInfo/Reviews/${spot_id}`,
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
        setSpotReviews(data);
      } catch (error) {
        setError(Error`fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchTouristSpotReviews();
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
      <h1>{spotData.name}</h1>
      <h2>Description:</h2>
      <p>{spotData.blog_description}</p>
      <h2>Location:</h2>
      <p>
        {`${spotData.union_name}, ${spotData.upazilla_name}, ${spotData.district_name}, ${spotData.division_name}`}
      </p>
      <h2>Reviews:</h2>
      <div className="reviews-list">
        {spotReviews.map((review, index) => (
          <ReviewCard key={index} data={review} />
        ))}
      </div>
    </div>
  );
}
