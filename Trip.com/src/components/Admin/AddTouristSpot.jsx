import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Signin&up/in&up.css";

export default function AddTouristSpot(props) {
  const [firstLevel, setFirstLevel] = useState("");
  const [secondLevel, setSecondLevel] = useState("");
  const [thirdLevel, setThirdLevel] = useState("");
  const [fourthLevel, setFourthLevel] = useState("");
  const [firstLevelOptions, setFirstLevelOptions] = useState([]);
  const [secondLevelOptions, setSecondLevelOptions] = useState([]);
  const [thirdLevelOptions, setThirdLevelOptions] = useState([]);
  const [fourthLevelOptions, setFourthLevelOptions] = useState([]);
  const [name, setName] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [image, setImage] = useState("");

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

  const handleAddSpot = async () => {
    try {
      const response = await fetch("http://localhost:4000/admin/addtouristspot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          division: firstLevel,
          district: secondLevel,
          upazilla: thirdLevel,
          union: fourthLevel,
          name: name,
          blogDescription: blogDescription,
          image: image,
        }),
      });

      if (response.ok) {
        alert("Added successfully");
        props.onClose();
      } else {
        const errorMessage = await response.text();
        console.log(
          `Error adding tourist spot: ${errorMessage || response.statusText}`
        );
      }
    } catch (error) {
      console.log(`Error adding tourist spot: ${error.message}`);
    }
  };

  return (
    <>
      <div className="modal-wrapper"></div>

      <div className="modal-container">
        <h1 className="header">Add Tourist Spot</h1>
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
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="input-style"
          />
          <input
            type="area"
            value={blogDescription}
            placeholder="Blog Description"
            onChange={(e) => {
              setBlogDescription(e.target.value);
            }}
            className="input-style"
          />
          <input
            type="text"
            value={image}
            placeholder="Image URL"
            onChange={(e) => {
              setImage(e.target.value);
            }}
            className="input-style"
          />
        </div>
        <div className="button-container">
          <button className="button--style" onClick={handleAddSpot}>
            Add
          </button>
        </div>
      </div>
    </>
  );
}
