import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../HomePage/Navbar";
import Hotelbasicdetails from "../hotel/Hotelbasicdetails";
import ReviewCard from "../hotel/ReviewCard";
import Room from "../hotel/Room";
import "./hotel.css";
import "../Signin&up/in&up.css";
import "../hotel/style.css";
export default function HotelDetails() {
  const { username } = useParams();
  const [details, setDetails] = useState([]);
  const [hotelDetails, setHotelDetails] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [hotelId, setHotelId] = useState(null);
  const fetchBookingRequestsRef = useRef();


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

  const [bookingRequests, setBookingRequests] = useState([]);

  useEffect(() => {
    // Function to fetch booking requests data
    fetchBookingRequestsRef.current = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/hotel/fetchBookingRequests/${username}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error("Error fetching booking requests");
          return;
        }

        const data = await response.json();
        setBookingRequests(data);
      } catch (error) {
        console.error("Error fetching booking requests", error);
      }
    };

    // Call fetchBookingRequests
    fetchBookingRequestsRef.current();
  }, [username]);

  const handleBookingAction = async (booking_id, action) => {
    try {
      console.log(
        `Performing ${action} action on booking request ${booking_id}`
      );
      const response = await fetch(
        `http://localhost:4000/hotel/BookingAction/${booking_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
          }),
        }
      );

      if (!response.ok) {
        console.error(`Error ${action} booking request`);
        return;
      }

      // Update the UI or perform additional actions as needed

      // Refetch booking requests after action
      fetchBookingRequestsRef.current();
    } catch (error) {
      console.error(`Error ${action} booking request`, error);
    }
  };

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

      <h2>Booking Requests:</h2>
      <div className="booking-requests-list">
        {bookingRequests.map((booking, index) => (
          <div key={index} className="booking-request">
            <p>Client: {booking.client_username}</p>
            <p>Room Type: {booking.room_type}</p>
            <p>No. of Rooms: {booking.no_of_rooms}</p>
            <p>Check-in Date: {booking.check_in_date}</p>
            <p>Check-out Date: {booking.check_out_date}</p>
            <p>Total Bill: {booking.total_bill}</p>
            <p>Payment Completion: {booking.payment_completion_status}</p>
            <button className="button--style handle"
              onClick={() => handleBookingAction(booking.booking_id, "approve")}
            >
              Approve
            </button>
            <button className="button--style handle"
              onClick={() => handleBookingAction(booking.booking_id, "deny")}
            >
              Deny
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
