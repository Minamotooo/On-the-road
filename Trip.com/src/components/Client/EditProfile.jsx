import React, { useState, useEffect } from "react"; // Add useEffect import
import { useNavigate } from "react-router-dom";
import "../Signin&up/in&up.css";
import { useParams } from "react-router-dom";

export default function EditProfile({ onClose }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [district, setDistrict] = useState("");
  const [division, setDivision] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [roadName, setRoadName] = useState("");
  const [roadNumber, setRoadNumber] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const { username } = useParams(); // Add this line

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/signin/user/${username}`
        );
        if (response.ok) {
          const data = await response.json();
          const formattedDateOfBirth = new Date(data.date_of_birth)
            .toISOString()
            .split("T")[0];
          console.log(data);
          setEmail(data.email);
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setDistrict(data.district);
          setDivision(data.division);
          setDateOfBirth(formattedDateOfBirth);
          setProfilePhoto(data.profile_photo);
          setPhoneNumber(data.phone_no);
          setZipCode(data.zip_code);
          setRoadName(data.road_name);
          setRoadNumber(data.road_no);
          setHouseNumber(data.house_no);
        } else {
          console.log("Error fetching user data: ", response.statusText);
        }
      } catch (error) {
        console.log("Error fetching user data: ", error.message);
      }
    };

    fetchUserData();
  }, [username]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/signin/update/${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            phone_no: phoneNumber,
            profile_photo: profilePhoto,
            division,
            district,
            zip_code: zipCode,
            house_no: houseNumber,
            road_no: roadNumber,
            road_name: roadName,
          }),
        }
      );

      if (response.ok) {
        alert("Profile updated successfully");
        navigate(`/client/${username}`);
        onClose();
      } else {
        const errorMessage = await response.text();
        console.log(`Error updating profile: ${errorMessage || response.statusText}`);
        alert(`Error updating profile: ${errorMessage || response.statusText}`);
      }
    } catch (error) {
      console.log(`Error updating profile: ${error.message}`);
      alert(`Error updating profile: ${error.message}`);
    }
  };
  return (
    <>
      <div className="modal-wrapper"></div>
      <div className="modal-container2">
        <div>
          <h2 className="header">Edit Profile</h2>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="input-container2">
          <div className="columns">
            <h4>Personal Info</h4>
            <input
              defaultValue={username}
              type="text"
              placeholder="username"
              readOnly
              className="input-username input-style"
            />

            <label className="errorLabel">{usernameError}</label>
            <input
              value={firstName}
              type="text" // ensure the password input hides the text
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              className="input-style"
            />
            <label className="errorLabel">{firstNameError}</label>
            <input
              value={lastName}
              type="text" // ensure the password input hides the text
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              className="input-style"
            />
            <label className="errorLabel">{lastNameError}</label>
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="input-style"
            />
            <input
              value={dateOfBirth}
              type="date" // ensure the password input hides the text
              placeholder="Date of Birth"
              onChange={(e) => setDateOfBirth(e.target.value)}
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
              placeholder="Upload the URL"
              onChange={(e) => setProfilePhoto(e.target.value)}
              className="input-style"
            />
          </div>

          <div className="columns">
            <h4>Address</h4>
            <input
              value={division}
              type="text" // ensure the password input hides the text
              placeholder="Division"
              onChange={(e) => setDivision(e.target.value)}
              className="input-style"
            />
            <input
              value={district}
              type="text" // ensure the password input hides the text
              placeholder="District"
              onChange={(e) => setDistrict(e.target.value)}
              className="input-style"
            />

            <input
              value={zipCode}
              type="text" // ensure the password input hides the text
              placeholder="Zip Code"
              onChange={(e) => setZipCode(e.target.value)}
              className="input-style"
            />
            <input
              value={houseNumber}
              type="text" // ensure the password input hides the text
              placeholder="House No."
              onChange={(e) => setHouseNumber(e.target.value)}
              className="input-style"
            />
            <input
              value={roadNumber}
              type="text" // ensure the password input hides the text
              placeholder="Road No."
              onChange={(e) => setRoadNumber(e.target.value)}
              className="input-style"
            />
            <input
              value={roadName}
              type="text" // ensure the password input hides the text
              placeholder="Road Name"
              onChange={(e) => setRoadName(e.target.value)}
              className="input-style"
            />
          </div>
        </div>
        <button className="button--style" onClick={handleUpdate}>
          Update
        </button>
      </div>
    </>
  );
}
