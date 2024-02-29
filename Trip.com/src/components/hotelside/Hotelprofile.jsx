import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../HomePage/Navbar";
import Hotelbasicdetails from "../hotel/Hotelbasicdetails";
import ReviewCard from "../hotel/ReviewCard";
import Room from "../hotel/Room";

export default function HotelDetails() {
  const { username } = useParams();
  const [details, setDetails] = useState([]);
  const [hotelDetails, setHotelDetails] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [hotelId, setHotelId] = useState(null);

  useEffect(() => {
    // Function to fetch reviews data
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

        // Fetch reviews
        const responseReviews = await fetch(
          `http://localhost:4000/hotel/review/${dataHotelId.hotelId}`
        );

        if (!responseReviews.ok) {
          console.error("Error fetching reviews");
          return;
        }

        const dataReviews = await responseReviews.json();
        setReviews(dataReviews);

        // Fetch hotel details
        const responseDetails = await fetch(
          `http://localhost:4000/hotel/details/${dataHotelId.hotelId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              hotelId: dataHotelId.hotelId,
            }),
          }
        );

        if (!responseDetails.ok) {
          console.error("Error fetching hotel details");
          return;
        }

        const dataDetails = await responseDetails.json();
        setHotelDetails(dataDetails);

        // Fetch hotel rooms
        const responseRooms = await fetch(
          `http://localhost:4000/hotel/fetchCurrentHotel/${dataHotelId.hotelId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              hotelId: dataHotelId.hotelId,
            }),
          }
        );

        if (!responseRooms.ok) {
          console.error("Error fetching hotel rooms");
          return;
        }

        const dataRooms = await responseRooms.json();
        setDetails(dataRooms);
      } catch (error) {
        console.error("Error in fetchHotelData", error);
      }
    };

    // Call fetchHotelData
    fetchHotelData();
  }, [username]);

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
