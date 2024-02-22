import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewCard from "./TouristSpot/touristSpotReviewCard";

export default function Details() {
  const { spot_id } = useParams();
  const [imageAddress, setImageAddress] = useState("");
  const [spotData, setSpotData] = useState({});
  const [spotReviews, setSpotReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const spotResponse = await fetch(
          `http://localhost:4000/touristSpotInfo/Details/${spot_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!spotResponse.ok) {
          throw new Error(
            `Fetching spot data failed: ${spotResponse.statusText}`
          );
        }

        const spotData = await spotResponse.json();
        setSpotData(spotData[0]);

        setImageAddress(spotData[0].image);

        const reviewsResponse = await fetch(
          `http://localhost:4000/touristSpotInfo/Reviews/${spot_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!reviewsResponse.ok) {
          throw new Error(
            `Fetching reviews failed: ${reviewsResponse.statusText}`
          );
        }

        const reviewsData = await reviewsResponse.json();
        setSpotReviews(reviewsData);
      } catch (error) {
        setError(`Fetching data failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [spot_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!spotData || Object.keys(spotData).length === 0) {
    return <div>No data found</div>;
  }

  return (
    <div>
      {imageAddress && (
        <img
          src={imageAddress}
          alt={spotData.name}
          style={{ maxWidth: "100%", height: "200px" }}
        />
      )}
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
