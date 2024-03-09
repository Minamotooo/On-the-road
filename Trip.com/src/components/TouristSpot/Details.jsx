import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Navbar from "../HomePage/Navbar";
import NeighboringSpotCard from "./NeighboringSpotCard"; // Assuming you have a component for displaying neighboring spots
import "./commentStyles.css";
import ReviewCard from "./touristSpotReviewCard";

export default function Details() {
  const { spot_id } = useParams();
  const [imageAddress, setImageAddress] = useState("");
  const [spotData, setSpotData] = useState({});
  const [spotReviews, setSpotReviews] = useState([]);
  const [neighboringSpots, setNeighboringSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  // State for posting comments
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch details of the current tourist spot
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

        // Fetch reviews for the current tourist spot
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

        // Fetch neighboring spots
        const neighboringSpotsResponse = await fetch(
          `http://localhost:4000/touristSpotInfo/Details/fetchneighboringspots/${spot_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!neighboringSpotsResponse.ok) {
          throw new Error(
            `Fetching neighboring spots failed: ${neighboringSpotsResponse.statusText}`
          );
        }

        const neighboringSpotsData = await neighboringSpotsResponse.json();
        setNeighboringSpots(neighboringSpotsData);
      } catch (error) {
        setError(`Fetching data failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [spot_id, spotReviews]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value, 10));
  };

  const handleSubmitComment = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/touristSpot/Reviews/postComment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating,
            comment,
            spot_id,
            username: user.username,
            // Add any other required data like user information if needed
          }),
        }
      );

      if (!response.ok) {
        console.error("Error posting comment:", response.statusText);
      }

      // Refresh comments after posting a new one
      // fetchComments();
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

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
      <Navbar />
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
      <h2>Comments:</h2>
      <div className="reviews-list">
        {spotReviews.map((review, index) => (
          <ReviewCard key={index} data={review} />
        ))}
      </div>

      <h2>Neighboring Spots:</h2>
      <div className="neighboring-spots-list">
        {neighboringSpots.map((neighborSpot) => (
          <Link
            key={neighborSpot.spot_id}
            to={`/touristspot/${neighborSpot.spot_id}`}
          >
            <NeighboringSpotCard data={neighborSpot} />
          </Link>
        ))}
      </div>
      {/* Add the form for submitting comments */}
      {user && user.role === "client" && (
        <div className="comment-form">
          <h2>Write a Comment:</h2>
          <div>
            <label htmlFor="comment">Comment:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={handleCommentChange}
            />
          </div>
          <div>
            <label htmlFor="rating">Rating:</label>
            <select id="rating" value={rating} onChange={handleRatingChange}>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <button className="button--style" onClick={handleSubmitComment}>
            Submit Comment
          </button>
        </div>
      )}
    </div>
  );
}
