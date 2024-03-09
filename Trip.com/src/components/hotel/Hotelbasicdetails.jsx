import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "../Signin&up/in&up.css";
import HotelProfileEdit from "../hotelside/HotelProfileEdit";
import "../hotelside/hotel.css";
import AddRoomModal from "./AddRoomModal";

export default function Hotelbasicdetails(props) {
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate();
  const { username } = useParams();
  const [hotelId, setHotelId] = useState(null);

  const [client_username, setClient_username] = useState([]);
  const [hotel_username, setHotel_username] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [imageURL, setImageURL] = useState("");

  //const { user } = useAuth(); // Access user information using the useAuth hook
  const { user, logout } = useAuth();
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
      } catch (error) {
        console.error("Error fetching hotelId:", error.message);
      }
    };
    fetchHotelData();
  }),
    [hotelId];

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
      console.log("*******USERNAME***:", username);
      setHotel_username(username);
      console.log(
        "Posting review:",
        rating,
        comment,
        imageURL,
        username,
        client_username
      );
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
            hotel_username: username,
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

  const [isAddRoomModalOpen, setAddRoomModalOpen] = useState(false);

  // State variables for room data
  const [newRoomType, setNewRoomType] = useState("");
  const [newAvailableRooms, setNewAvailableRooms] = useState("");
  const [newAmenities, setNewAmenities] = useState("");
  const [newPricePerNight, setNewPricePerNight] = useState("");
  const [newNumberOfGuests, setNewNumberOfGuests] = useState("");
  const [newRoomImageURL, setNewRoomImageURL] = useState("");

  // Function to open the Add Room modal
  const openAddRoomModal = () => {
    setAddRoomModalOpen(true);
  };

  // Function to close the Add Room modal
  const closeAddRoomModal = () => {
    setAddRoomModalOpen(false);
  };

  // Function to handle the addition of a new room
  const handleAddRoom = async (newRoomData) => {
    // Perform any necessary actions, e.g., making a POST request to add the room
    // You can use the newRoomData to send the details to your backend
    console.log("New Room Data:", newRoomData);
    try {
      //Send a POST request to update room information
      //const hotelID = newRoomData.hotelId;
      const response = await fetch(
        `http://localhost:4000/hotel/insertNewRoom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomType: newRoomData.roomType,
            hotelID: hotelId,
            availableRooms: newRoomData.availableRooms,
            amenities: newRoomData.amenities,
            pricePerNight: newRoomData.pricePerNight,
            numberOfGuests: newRoomData.numberOfGuests,
            roomImageURL: newRoomData.roomImageURL,
            // Include other required information
            //...editedData,
          }),
        }
      );
      if (!response.ok) {
        console.error("Error updating room information:", response.statusText);
        // Handle the error, show a message to the user, or take appropriate action
        return;
      }
      // Refresh the room details after updating
      // fetchHotelRooms();
    } catch (error) {
      console.error("Error updating room information:", error.message);
      // Handle the error, show a message to the user, or take appropriate action
    }
    setAddRoomModalOpen(false);
    // You might want to refresh the room data or perform additional actions after adding a room
  };

  const handleUpdate = () => {
    setShowEdit(true);
  };
  // Access user information using the useAuth hook
  // console.log("User:", user.username, user.role);
  // In handleDeleteClick function
  const handleDelete = async () => {
    try {
      console.log("Deleting user:", user.username);

      const response = await fetch(
        `http://localhost:4000/hotel/delete/${user.username}`,
        {
          method: "DELETE",
        }
      );

      console.log("Response from server:", response);

      if (response.ok) {
        navigate("/");
        logout();
      } else {
        console.log(`Error deleting user: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`Error deleting user: ${error.message}`);
    }
  };

  const onClose = () => setShowEdit(false);
  const data = props.data;
  //console.log(props.data);

  return (
    <div className="hotel-header">
      <div>
        <h1> {data.name}</h1>
        <div className="hotel-rating"></div>
      </div>
      {/* Icons can be added as needed */}

      <div className="hotel-overview">
        <div className="about-section">
          <h2>Location: </h2>
          <p>{data.address}</p>
          <h2>About</h2>

          {/* Additional rating details */}
          <p className="hotel-description">
            {data.description}
            {/* Truncated for brevity */}
          </p>
          <h2>Contact us:</h2>
          <p>Phone: {data.phone_no}</p>
          <p>Email: {data.email}</p>
        </div>
        {user && user.username === data.username && user.role === "hotel" && (
          <div>
            <button className="button--style" onClick={openAddRoomModal}>
              Add Room
            </button>
            <AddRoomModal
              isOpen={isAddRoomModalOpen}
              onClose={closeAddRoomModal}
              onAdd={handleAddRoom}
              hotelId={hotelId} // Pass the hotelId to the modal
            />
            <button className="button--style" onClick={handleUpdate}>
              Edit Hotel Profile
            </button>
            <button className="button--style" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
      {showEdit && <HotelProfileEdit onClose={onClose} />}

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
