import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "./in&up.css";

export default function RestaurantaSignup(props) {
  const [firstLevel, setFirstLevel] = useState("");
  const [secondLevel, setSecondLevel] = useState("");
  const [thirdLevel, setThirdLevel] = useState("");
  const [fourthLevel, setFourthLevel] = useState("");
  const [firstLevelOptions, setFirstLevelOptions] = useState([]);
  const [secondLevelOptions, setSecondLevelOptions] = useState([]);
  const [thirdLevelOptions, setThirdLevelOptions] = useState([]);
  const [fourthLevelOptions, setFourthLevelOptions] = useState([]);
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");

  const [imageURL, setImageURL] = useState(null);

  const { login } = useAuth();

  const navigate = useNavigate();

  // Simulate fetching data from a database
  useEffect(() => {
    // Fetch the Division options
    const fetchDivisions = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/hotelSignUp/divisions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: "Get divisions",
            }),
          }
        );
        console.log("Request sent");
        console.log(response);
        if (response.ok) {
          console.log("Response received");
          const data = await response.json();
          console.log(data);
          setFirstLevelOptions(
            data.success ? data.data.map((division) => division.name) : []
          );
        } else {
          const errorMessage = await response.text();
          console.log(
            `Error getting division: ${errorMessage || response.statusText}`
          );
        }
      } catch (error) {
        console.log(`Error getting division: ${error.message}`);
      }
    };
    fetchDivisions();
  }, []);

  useEffect(() => {
    // Reset second level when first level changes
    setSecondLevel("");

    const fetchDistricts = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/hotelSignUp/districts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstLevel,
            }),
          }
        );
        console.log("Request sent");
        console.log(response);
        if (response.ok) {
          console.log("Response received");
          const data = await response.json();
          console.log(data);
          setSecondLevelOptions(
            data.success ? data.data.map((district) => district.name) : []
          );
        } else {
          const errorMessage = await response.text();
          console.log(
            `Error getting district: ${errorMessage || response.statusText}`
          );
        }
      } catch (error) {
        console.log(`Error getting district: ${error.message}`);
      }
    };
    fetchDistricts();
  }, [firstLevel]);

  useEffect(() => {
    setThirdLevel("");
    const fetchUpazillas = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/hotelSignUp/upazillas",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              secondLevel,
            }),
          }
        );
        console.log("Request sent");
        console.log(response);
        if (response.ok) {
          console.log("Response received");
          const data = await response.json();
          console.log(data);
          setThirdLevelOptions(
            data.success ? data.data.map((upazilla) => upazilla.name) : []
          );
        } else {
          const errorMessage = await response.text();
          console.log(
            `Error getting upazilla: ${errorMessage || response.statusText}`
          );
        }
      } catch (error) {
        console.log(`Error getting upazilla: ${error.message}`);
      }
    };
    fetchUpazillas();
  }, [secondLevel]);

  useEffect(() => {
    setFourthLevel("");
    const fetchUnions = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/hotelSignUp/unions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              thirdLevel,
            }),
          }
        );
        console.log("Request sent");
        console.log(response);
        if (response.ok) {
          console.log("Response received");
          const data = await response.json();
          console.log(data);
          setFourthLevelOptions(
            data.success ? data.data.map((union) => union.name) : []
          );
        } else {
          const errorMessage = await response.text();
          console.log(
            `Error getting union: ${errorMessage || response.statusText}`
          );
        }
      } catch (error) {
        console.log(`Error getting union: ${error.message}`);
      }
    };
    fetchUnions();
  }, [thirdLevel]);

  //Handling signup data

  const handleSignUp = async () => {
    try {
      const response = await fetch("http://localhost:4000/signin/restaurant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: props.email,
          username: props.username,
          password: props.password,
          businessType: props.businessType,
          division: firstLevel,
          district: secondLevel,
          upazila: thirdLevel,
          union: fourthLevel,
          name,
          cuisine,
          phoneNo,
          imageURL,
        }),
      });

      if (response.ok) {
        alert("User registered successfully");
        login({ username: props.username, email: props.email });
        navigate(`/Restaurant/${props.username}`);
      } else {
        const errorMessage = await response.text();
        console.log(`Error signing up: ${errorMessage || response.statusText}`);
      }
    } catch (error) {
      console.log(`Error signing up: ${error.message}`);
    }
  };

  return (
    <>
      <div className="modal-wrapper"></div>

      <div className="modal-container">
        <h1 className="header">Finish setting up your account</h1>
        <button type="button" className="close-button" onClick={props.onClose}>
          &times;
        </button>
        <div className="input-container">
          <select
            value={firstLevel}
            onChange={(e) => setFirstLevel(e.target.value)}
            className="input-style"
          >
            <option value="">Select Your Division</option>
            {firstLevelOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={secondLevel}
            onChange={(e) => setSecondLevel(e.target.value)}
            className="input-style"
            disabled={!firstLevel}
          >
            <option value="">Select Your District</option>
            {secondLevelOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={thirdLevel}
            onChange={(e) => setThirdLevel(e.target.value)}
            className="input-style"
            disabled={!secondLevel}
          >
            <option value="">Select Your Upazilla</option>
            {thirdLevelOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={fourthLevel}
            onChange={(e) => setFourthLevel(e.target.value)}
            className="input-style"
            disabled={!thirdLevel}
          >
            <option value="">Select Your Union</option>
            {fourthLevelOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="input-container">
          <input
            type="text"
            value={name}
            placeholder="Restaurant Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="input-style"
          />
          <input
            type="text"
            value={cuisine}
            placeholder="Cuisine"
            onChange={(e) => {
              setCuisine(e.target.value);
            }}
            className="input-style"
          />
          <input
            type="text"
            value={phoneNo}
            placeholder="Restaurant Phone Number"
            onChange={(e) => {
              setPhoneNo(e.target.value);
            }}
            className="input-style"
          />
          <input
            type="text"
            value={imageURL}
            placeholder="Drop Image URL"
            onChange={(e) => {
              setImageURL(e.target.value);
            }}
            className="input-style"
          />
        </div>
        <div className="button-container">
          <button className="button--style" onClick={handleSignUp}>
            Sign up
          </button>
        </div>
      </div>
    </>
  );
}
