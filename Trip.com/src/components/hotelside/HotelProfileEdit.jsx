// ... (import statements remain unchanged)
import React, { useState, useEffect } from "react"; // Add useEffect import
import { useNavigate } from "react-router-dom";
import "../Signin&up/in&up.css";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";

export default function HotelProfileEdit({ onClose }) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [description, setDescription] = useState("");
    const [hotelId, setHotelId] = useState(null);
  
    const { username } = useParams();
     
    const navigate = useNavigate();
  
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

            console.log("................................................................................................");
            console.log("HOTEL ID: ", dataHotelId.hotelId);     

            // Fetch hotel details
            const response = await fetch(
              `http://localhost:4000/hotel/details/${hotelId}`,
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
  
          if (response.ok) {
            const data = await response.json();
            console.log("................................................................................................");
            console.log("HOTEL DATA: ", data);
            setEmail(data.email);
            setName(data.name);
            setProfilePhoto(data.photo);
            setPhoneNumber(data.phone_no);
            setDescription(data.description);
          } else {
            console.log("Error fetching user data: ", response.statusText);
          }
        } catch (error) {
          console.log("Error fetching user data: ", error.message);
        }
      };
  
      fetchHotelData();
    }, [username]);
  
    const handleUpdate = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/hotel/update/${hotelId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              name,
              phone_no: phoneNumber,
              photo: profilePhoto,
              description,
            }),
          }
        );
  
        if (response.ok) {
          alert("Profile updated successfully");
          navigate(`/hotel/${username}`);
          onClose();
        } else {
          const errorMessage = await response.text();
          console.log(
            `Error updating profile: ${errorMessage || response.statusText}`
          );
        }
      } catch (error) {
        console.log(`Error updating profile: ${error.message}`);
      }
    };
  
    return (
      <>
        <div className="modal-wrapper"></div>
        <div className="modal-container2">
          <div>
            <h2 className="header">Edit Info</h2>
            <button type="button" className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="input-container2">
          <input
              value={name}
              type="text" // ensure the password input hides the text
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              className="input-style"
            />
            <input
              value={email}
              type="text" // ensure the password input hides the text
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="input-style"
            />
            <input
              value={phoneNumber}
              type="text" // ensure the password input hides the text
              placeholder="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input-style"
            />
            <input
              value={profilePhoto}
              type="text" // ensure the password input hides the text
              placeholder="Profile Photo"
              onChange={(e) => setProfilePhoto(e.target.value)}
              className="input-style"
            />
            <input
              value={description}
              type="text" // ensure the password input hides the text
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              className="input-style"
            />
          </div>
          <button className="button--style" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </>
    );
  }
  
