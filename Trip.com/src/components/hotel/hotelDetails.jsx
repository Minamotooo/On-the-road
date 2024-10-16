import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Navbar from "../HomePage/Navbar";
import "../Signin&up/in&up.css";

import Hotelbasicdetails from "./Hotelbasicdetails";
import ReviewCard from "./ReviewCard";
import "./ReviewFormStyles.css";
import Room from "./Room";

export default function HotelDetails() {
  const { username } = useParams(); // Destructure hotelId from the params
  const [hotelId, setHotelId] = useState(null); // Initialize hotelId state with null
  const { user } = useAuth();
  const [client_username, setClient_username] = useState([]);
  //console.log("HotelId from HotelDetails.jsx:", hotelId);
  const [details, setDetails] = useState([]);
  const [hotelDetails, setHotelDetails] = useState([]);
  const [hotel_username, setHotel_username] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [imageURL, setImageURL] = useState("");
  console.log("********************CUrrently logged in user:", user);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        // Fetch hotelId
        const responseHotelId = await fetch(
          `http://localhost:4000/hotel/fetchHotelId/${username}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
            }),
          }
        );

        if (!responseHotelId.ok) {
          console.error("Error fetching hotelId");
          return;
        }

        const dataHotelId = await responseHotelId.json();
        setHotelId(dataHotelId.hotelId);
      } catch (error) {
        console.error("Error fetching hotelId:", error.message);
      }
    };
    fetchHotelData();

    // Function to fetch reviews data
    async function fetchReviews() {
      try {
        console.log("********************CUrrently logged in user:", user);
        const response = await fetch(
          `http://localhost:4000/hotel/review/${hotelId}`
        );
        if (!response.ok) {
          console.error("Error fetching reviews:");
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }

    fetchReviews();

    // Function to fetch hotels data
    async function fetchHotelDetails() {
      try {
        // Make a POST request to your backend endpoint
        const response = await fetch(
          `http://localhost:4000/hotel/details/${hotelId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Include other headers like authorization if needed
            },
            body: JSON.stringify({
              // Include any body content required by your POST endpoint, if necessary
              hotelId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Set the hotels data to state
        setHotelDetails(data);
        setHotel_username(data.username); // Assuming the username is in the response data
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    }

    // Call the fetchHotels function
    fetchHotelDetails();
    // The empty array as a second argument ensures useEffect runs once after initial render

    async function fetchHotelRooms() {
      try {
        const response = await fetch(
          `http://localhost:4000/hotel/fetchCurrentHotel/${hotelId}`, // Use backticks for template literals
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ hotelId }), // Assuming your backend needs the hotelId in the body
          }
        );

        if (!response.ok) {
          console.error("Error fetching hotels:", response.statusText);
        }

        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    }

    if (hotelId) {
      // Check if hotelId is not null or undefined
      fetchHotelRooms();
    }
    // Include hotelId in the dependency array

    const handleRatingChange = (event) => {
      setRating(parseInt(event.target.value, 10));
    };

    const handleCommentChange = (event) => {
      setComment(event.target.value);
    };

    const handleImageURLChange = (event) => {
      setImageURL(event.target.value);
    };

    const handleSubmitReview = async () => {
      try {
        setClient_username(user.username);
        // console.log(
        //   "Posting review:",
        //   rating,
        //   comment,
        //   imageURL,
        //   hotel_username,
        //   client_username
        // );
        const response = await fetch(
          "http://localhost:4000/hotel/review/postReview",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Include other headers like authorization if needed
            },
            body: JSON.stringify({
              rating,
              comment,
              imageURL,
              hotel_username,
              client_username,
              // Add any other required data like client username and hotel username
            }),
          }
        );

        if (!response.ok) {
          console.error("Error posting review:", response.statusText);
        }

        // Refresh reviews after posting a new one
        //fetchReviews();
      } catch (error) {
        console.error("Error posting review:", error);
      }
    };
  }),
    [hotelId, reviews, details];
  return (
    <div>
      <Navbar />
      <Hotelbasicdetails data={hotelDetails} />

      <h2>Rooms:</h2>

      {details.map((detail, index) => (
        <Room key={index} data={detail} hotelID={hotelId} />
      ))}
      <h2>Reviews:</h2>
      <div className="reviews-list">
        {reviews.map((review, index) => (
          <ReviewCard key={index} data={review} />
        ))}
      </div>
      {/* Review Form */}
      {/* Review Form */}
      {user && user.role === "client" && (
        <div className="review-form">
          <h2>Write a Review:</h2>
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
          <div>
            <label htmlFor="comment">Comment:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={handleCommentChange}
            />
          </div>
          <div>
            <label htmlFor="imageURL">Image URL:</label>
            <input
              type="text"
              id="imageURL"
              value={imageURL}
              onChange={handleImageURLChange}
            />
          </div>
          <button className="button--style" onClick={handleSubmitReview}>
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
}
