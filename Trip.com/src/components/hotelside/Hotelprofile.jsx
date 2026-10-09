import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Navbar from "../HomePage/Navbar";
import Hotelbasicdetails from "../hotel/Hotelbasicdetails";
import ReviewCard from "../hotel/ReviewCard";
import Room from "../hotel/Room";
import {
  API,
  RatingPicker,
  SectionHead,
  postJSON,
  prettyDate,
  taka,
} from "../Shared/ui";

export default function HotelDetails() {
  const { username } = useParams();
  const [details, setDetails] = useState([]);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [hotelId, setHotelId] = useState(null);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [requestNote, setRequestNote] = useState("");
  const [notFound, setNotFound] = useState(false);

  // review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [reviewNote, setReviewNote] = useState("");

  const { user } = useAuth();
  const isOwner = user && user.role === "hotel" && user.username === username;

  const loadHotel = useCallback(async () => {
    try {
      const responseHotelId = await postJSON(`${API}/hotel/fetchHotelId/${username}`, { username });
      if (!responseHotelId.ok) {
        setNotFound(true);
        return;
      }
      const { hotelId: id } = await responseHotelId.json();
      setHotelId(id);

      // Close any stays whose check-out date has passed
      await postJSON(`${API}/hotel/triggerProcedure`);

      const [reviewsRes, detailsRes, roomsRes] = await Promise.all([
        fetch(`${API}/hotel/review/${id}`),
        postJSON(`${API}/hotel/details/${id}`, { hotelId: id }),
        postJSON(`${API}/hotel/fetchCurrentHotel/${id}`, { hotelId: id }),
      ]);
      if (reviewsRes.ok) {
        const data = await reviewsRes.json();
        setReviews(data.sort((a, b) => b.review_id - a.review_id));
      }
      if (detailsRes.ok) setHotelDetails(await detailsRes.json());
      if (roomsRes.ok) {
        const rooms = await roomsRes.json();
        setDetails(rooms.sort((a, b) => Number(a.price_per_night) - Number(b.price_per_night)));
      }
    } catch (error) {
      console.error("Error in fetchHotelData", error);
    }
  }, [username]);

  const loadRequests = useCallback(async () => {
    try {
      const response = await postJSON(`${API}/hotel/fetchBookingRequests/${username}`);
      if (response.ok) setBookingRequests(await response.json());
    } catch (error) {
      console.error("Error fetching booking requests", error);
    }
  }, [username]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadHotel();
  }, [loadHotel]);

  useEffect(() => {
    if (isOwner) loadRequests();
  }, [isOwner, loadRequests]);

  const handleBookingAction = async (booking_id, action) => {
    setRequestNote("");
    try {
      const response = await postJSON(`${API}/hotel/BookingAction/${booking_id}`, { action });
      if (!response.ok) {
        setRequestNote("Not enough rooms left to approve that request.");
        return;
      }
      await Promise.all([loadRequests(), loadHotel()]);
    } catch (error) {
      console.error(`Error ${action} booking request`, error);
    }
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if (!comment.trim()) {
      setReviewNote("Tell other travellers a little about your stay first.");
      return;
    }
    try {
      const response = await postJSON(`${API}/hotel/review/postReview`, {
        rating,
        comment: comment.trim(),
        imageURL: imageURL.trim() || null,
        hotel_username: username,
        client_username: user.username,
      });
      if (!response.ok) throw new Error(response.statusText);
      setComment("");
      setImageURL("");
      setRating(5);
      setReviewNote("Thanks for your review!");
      loadHotel();
    } catch (error) {
      console.error("Error posting review:", error);
      setReviewNote("Could not post your review, please try again.");
    }
  };

  if (notFound) {
    return (
      <div className="otr-page">
        <Navbar />
        <p className="otr-wrap otr-empty">We couldn't find that hotel.</p>
      </div>
    );
  }

  return (
    <div className="otr-page">
      <Navbar />
      {hotelDetails && (
        <Hotelbasicdetails
          data={hotelDetails}
          hotelId={hotelId}
          reviewCount={reviews.length}
          fromPrice={details[0]?.price_per_night}
          roomPhoto={details[details.length - 1]?.image}
          onChanged={loadHotel}
        />
      )}

      <div className="otr-wrap">
        {isOwner && (
          <section className="otr-section">
            <SectionHead
              kicker={`${bookingRequests.length} waiting`}
              title="Booking requests"
            />
            {requestNote && <p className="otr-note">{requestNote}</p>}
            {bookingRequests.length === 0 ? (
              <p className="otr-empty">No pending requests right now.</p>
            ) : (
              <table className="otr-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Rooms</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {bookingRequests.map((booking) => (
                    <tr key={booking.booking_id}>
                      <td>{booking.client_username}</td>
                      <td>{booking.room_type}</td>
                      <td>{booking.no_of_rooms}</td>
                      <td>{prettyDate(booking.check_in_date)}</td>
                      <td>{prettyDate(booking.check_out_date)}</td>
                      <td>{taka(booking.total_bill)}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <button
                          className="otr-btn otr-btn--small"
                          onClick={() => handleBookingAction(booking.booking_id, "approve")}
                        >
                          Approve
                        </button>{" "}
                        <button
                          className="otr-btn otr-btn--ghost otr-btn--small"
                          onClick={() => handleBookingAction(booking.booking_id, "deny")}
                        >
                          Deny
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        <section className="otr-section">
          <SectionHead kicker="Choose your room" title="Rooms & rates" />
          {details.length === 0 ? (
            <p className="otr-empty">No rooms listed yet.</p>
          ) : (
            details.map((detail) => (
              <Room
                key={detail.room_type}
                data={detail}
                hotelID={hotelId}
                isOwner={isOwner}
                onChanged={loadHotel}
              />
            ))
          )}
        </section>

        <section className="otr-section">
          <SectionHead kicker="Guest reviews" title="What guests are saying" />
          {reviews.length === 0 ? (
            <p className="otr-empty">No reviews yet.</p>
          ) : (
            <div className="otr-reviews">
              {reviews.map((review) => (
                <ReviewCard key={review.review_id} data={review} />
              ))}
            </div>
          )}
        </section>

        {user && user.role === "client" && (
          <section className="otr-section">
            <div className="otr-panel">
              <SectionHead kicker="Stayed here?" title="Write a review" small />
              <form className="otr-form" onSubmit={handleSubmitReview}>
                <label>Your rating</label>
                <RatingPicker value={rating} onChange={setRating} />
                <label htmlFor="comment">Your review</label>
                <textarea
                  id="comment"
                  value={comment}
                  placeholder="How was the room, the food, the people?"
                  onChange={(e) => setComment(e.target.value)}
                />
                <label htmlFor="imageURL">Photo link (optional)</label>
                <input
                  type="text"
                  id="imageURL"
                  value={imageURL}
                  placeholder="https://…"
                  onChange={(e) => setImageURL(e.target.value)}
                />
                <div>
                  <button type="submit" className="otr-btn">
                    Post review
                  </button>
                </div>
                {reviewNote && <span className="otr-note">{reviewNote}</span>}
              </form>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
