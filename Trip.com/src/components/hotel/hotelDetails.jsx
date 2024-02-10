import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../HomePage/Navbar";
import Hotelbasicdetails from "./Hotelbasicdetails";
import ReviewCard from "./ReviewCard";
import Room from "./Room";

export default function HotelDetails() {
  const { hotelId } = useParams(); // Destructure hotelId from the params
  const [details, setDetails] = useState([]);
  const [hotelDetails, setHotelDetails] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Function to fetch reviews data
    async function fetchReviews() {
      try {
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
  }, []);

  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    }

    // Call the fetchHotels function
    fetchHotelDetails();
  }, []); // The empty array as a second argument ensures useEffect runs once after initial render

  useEffect(() => {
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
  }, [hotelId]); // Include hotelId in the dependency array

  return (
    <div>
      <Navbar />
      <Hotelbasicdetails data={hotelDetails} />
      <h2>Rooms:</h2>
      {details.map((detail, index) => (
        <Room key={index} data={detail} />
      ))}
      <h2>Reviews:</h2>
      <div className="reviews-list">
        {reviews.map((review, index) => (
          <ReviewCard key={index} data={review} />
        ))}
      </div>
    </div>
  );
}
