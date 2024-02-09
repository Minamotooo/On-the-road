import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function HotelSignup(props) {
  const [firstLevel, setFirstLevel] = useState("");
  const [secondLevel, setSecondLevel] = useState("");
  const [thirdLevel, setThirdLevel] = useState("");
  const [fourthLevel, setFourthLevel] = useState("");
  const [firstLevelOptions, setFirstLevelOptions] = useState([]);
  const [secondLevelOptions, setSecondLevelOptions] = useState([]);
  const [thirdLevelOptions, setThirdLevelOptions] = useState([]);
  const [fourthLevelOptions, setFourthLevelOptions] = useState([]);
  const [hotelname, setHotelName] = useState("");
  const [hoteladdress, setHotelAddress] = useState("");
  const [hotelphonenumber, setHotelPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const navigate = useNavigate(); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.substr(0, 5) === "image") {
      setImage(file);
      console.log(URL);

      // Use FileReader to generate a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreviewUrl("");
    }
  };

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
          setError(
            `Error getting division: ${errorMessage || response.statusText}`
          );
        }
      } catch (error) {
        setError(`Error getting division: ${error.message}`);
      } finally {
        setLoading(false);
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
          setError(
            `Error getting district: ${errorMessage || response.statusText}`
          );
        }
      } catch (error) {
        setError(`Error getting district: ${error.message}`);
      } finally {
        setLoading(false);
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
          setError(
            `Error getting upazilla: ${errorMessage || response.statusText}`
          );
        }
      } catch (error) {
        setError(`Error getting upazilla: ${error.message}`);
      } finally {
        setLoading(false);
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
          setError(
            `Error getting union: ${errorMessage || response.statusText}`
          );
        }
      } catch (error) {
        setError(`Error getting union: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchUnions();
  }, [thirdLevel]);

  //Handling signup data

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:4000/hotelSignUp/", {
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
          hotelname: hotelname,
          hoteladdress: hoteladdress,
          hotelphonenumber: hotelphonenumber,
          image: previewUrl,
        }),
      });

      console.log(previewUrl);

      if (response.ok) {
        console.log("User registered successfully");
        console.log(props.username);
        navigate(`/hotel/${props.username}`);
      } else {
        const errorMessage = await response.text();
        setError(`Error signing up: ${errorMessage || response.statusText}`);
      }
    } catch (error) {
      setError(`Error signing up: ${error.message}`);
    } finally {
      setLoading(false);
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
            value={hotelname}
            placeholder="Hotel Name"
            onChange={(e) => {
              setHotelName(e.target.value);
            }}
            className="input-style"
          />
          <input
            type="text"
            value={hoteladdress}
            placeholder="Hotel Address"
            onChange={(e) => {
              setHotelAddress(e.target.value);
            }}
            className="input-style"
          />
          <input
            type="text"
            value={hotelphonenumber}
            placeholder="Hotel Phone Number"
            onChange={(e) => {
              setHotelPhoneNumber(e.target.value);
            }}
            className="input-style"
          />
          <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: "100px", height: "100px" }}
              />
            )}
          </div>
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
