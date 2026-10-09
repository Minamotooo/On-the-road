import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Navbar from "../HomePage/Navbar";
import { API, Avatar, SectionHead, postJSON, prettyDate, taka } from "../Shared/ui";
import EditProfile from "./EditProfile";

function BookingTable({ bookings, empty }) {
  if (!bookings || bookings.length === 0) return <p className="otr-empty">{empty}</p>;
  return (
    <table className="otr-table">
      <thead>
        <tr>
          <th>Hotel</th>
          <th>Room</th>
          <th>Rooms</th>
          <th>Check-in</th>
          <th>Check-out</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking) => (
          <tr key={booking.booking_id}>
            <td>
              <Link to={`/hotel/${booking.hotel_username}`} style={{ color: "inherit" }}>
                {booking.name}
              </Link>
            </td>
            <td>{booking.room_type}</td>
            <td>{booking.no_of_rooms}</td>
            <td>{prettyDate(booking.check_in_date)}</td>
            <td>{prettyDate(booking.check_out_date)}</td>
            <td>{taka(booking.total_bill)}</td>
            <td>
              <span className={`otr-status otr-status--${booking.payment_completion_status}`}>
                {booking.payment_completion_status.toLowerCase()}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const username = user?.username;

  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [pendingHotelBookings, setPendingHotelRequests] = useState([]);
  const [approvedHotelBookings, setApprovedHotelRequests] = useState([]);

  const load = useCallback(async () => {
    if (!username) return;
    try {
      const [profile, pending, approved] = await Promise.all([
        fetch(`${API}/signin/user/${username}`),
        postJSON(`${API}/hotel/fetchPendingRequests/${username}`),
        postJSON(`${API}/hotel/fetchApprovedRequests/${username}`),
      ]);
      if (!profile.ok) throw new Error(profile.statusText);
      setUserData(await profile.json());
      if (pending.ok) setPendingHotelRequests(await pending.json());
      if (approved.ok) {
        const rows = await approved.json();
        setApprovedHotelRequests(rows.sort((a, b) => b.check_in_date.localeCompare(a.check_in_date)));
      }
    } catch (err) {
      setError(`Error fetching user data: ${err.message}`);
    }
  }, [username]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDeleteClick = async () => {
    if (!window.confirm("Delete your account? An admin can restore it later.")) return;
    try {
      const response = await fetch(`${API}/signin/user/${username}`, { method: "DELETE" });
      if (response.ok) {
        logout();
        navigate("/");
      } else {
        setError(`Error deleting user: ${response.statusText}`);
      }
    } catch (err) {
      setError(`Error deleting user: ${err.message}`);
    }
  };

  if (!user) {
    return (
      <div className="otr-page">
        <Navbar />
        <p className="otr-wrap otr-empty">Please log in to see your dashboard.</p>
      </div>
    );
  }

  const fullName = userData ? `${userData.first_name} ${userData.last_name}` : username;
  const address = userData
    ? [userData.house_no, userData.road_no && `Road ${userData.road_no}`, userData.road_name, userData.district]
        .filter(Boolean)
        .join(", ") + (userData.zip_code ? ` - ${userData.zip_code}` : "")
    : "";

  return (
    <div className="otr-page">
      <Navbar />
      <section className="otr-wrap otr-hero">
        <div className="otr-hero__text">
          <p className="otr-kicker">My journeys</p>
          <h1 className="otr-hero__title">Hello, {userData?.first_name || username}!</h1>
          <p className="otr-hero__sub">Your profile, upcoming stays and travel history, all in one place.</p>
          <div className="otr-chips">
            <Link to="/touristspot" className="otr-btn" style={{ textDecoration: "none" }}>
              Plan a new trip
            </Link>
            <button className="otr-btn otr-btn--ghost" onClick={() => setShowEditProfile(true)}>
              Edit profile
            </button>
            <button className="otr-btn otr-btn--ghost" onClick={handleDeleteClick}>
              Delete account
            </button>
          </div>
        </div>
        <div className="otr-panel" style={{ width: 330, marginRight: 70, textAlign: "center" }}>
          <Avatar name={userData?.first_name || username} photo={userData?.profile_photo} large />
          <h3 style={{ marginTop: 14, marginBottom: 2 }}>{fullName}</h3>
          <div className="otr-muted">@{username}</div>
          <div className="otr-facts" style={{ justifyContent: "center", marginTop: 18, textAlign: "left" }}>
            <div>
              <span className="otr-facts__label">Email</span>
              {userData?.email}
            </div>
            <div>
              <span className="otr-facts__label">Phone</span>
              {userData?.phone_no || "—"}
            </div>
            <div>
              <span className="otr-facts__label">Born</span>
              {userData?.date_of_birth?.replace(/\s+/g, " ").replace(" ,", ", ") || "—"}
            </div>
            <div>
              <span className="otr-facts__label">Address</span>
              {address || "—"}
            </div>
          </div>
        </div>
      </section>

      <div className="otr-wrap">
        {error && <p className="otr-note">{error}</p>}
        <section className="otr-section">
          <SectionHead kicker="Waiting for the hotel" title="Pending booking requests" small />
          <BookingTable bookings={pendingHotelBookings} empty="No pending booking requests." />
        </section>
        <section className="otr-section">
          <SectionHead kicker="Confirmed & past stays" title="Booking history" small />
          <BookingTable bookings={approvedHotelBookings} empty="No trips yet. Time to hit the road!" />
        </section>
      </div>
      {showEditProfile && (
        <EditProfile
          onClose={() => {
            setShowEditProfile(false);
            load();
          }}
        />
      )}
    </div>
  );
}
