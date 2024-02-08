import React, { useEffect, useState } from "react";

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

    // Fetch second level options based on the first level selection
    if (firstLevel === "Option 1") {
      setSecondLevelOptions(["Suboption 1.1", "Suboption 1.2"]);
    } else if (firstLevel === "Option 2") {
      setSecondLevelOptions(["Suboption 2.1", "Suboption 2.2"]);
    } else if (firstLevel === "Option 3") {
      setSecondLevelOptions(["Suboption 3.1", "Suboption 3.2"]);
    }
  }, [firstLevel]);

  useEffect(() => {
    setThirdLevel("");
    if (secondLevel === "Suboption 1.1") {
      setThirdLevelOptions(["Suboption 1.1.1", "Suboption 1.1.2"]);
    } else if (secondLevel === "Suboption 1.2") {
      setThirdLevelOptions(["Suboption 1.2.1", "Suboption 1.2.2"]);
    } else if (secondLevel === "Suboption 2.1") {
      setThirdLevelOptions(["Suboption 2.1.1", "Suboption 2.1.2"]);
    } else if (secondLevel === "Suboption 2.2") {
      setThirdLevelOptions(["Suboption 2.2.1", "Suboption 2.2.2"]);
    } else if (secondLevel === "Suboption 3.1") {
      setThirdLevelOptions(["Suboption 3.1.1", "Suboption 3.1.2"]);
    } else if (secondLevel === "Suboption 3.2") {
      setThirdLevelOptions(["Suboption 3.2.1", "Suboption 3.2.2"]);
    }
  }, [secondLevel]);

  useEffect(() => {
    setFourthLevel("");
    if (thirdLevel === "Suboption 1.1.1") {
      setFourthLevelOptions(["Suboption 1.1.1.1", "Suboption 1.1.1.2"]);
    } else if (thirdLevel === "Suboption 1.1.2") {
      setFourthLevelOptions(["Suboption  1.1.2.1", "Suboption 1.1.2.2"]);
    } else if (thirdLevel === "Suboption 1.2.1") {
      setFourthLevelOptions(["Suboption x", "Suboption y"]);
    } else if (thirdLevel === "Suboption 1.2.2") {
      setFourthLevelOptions(["Suboption x", "Suboption y"]);
    } else if (thirdLevel === "Suboption 2.1.1") {
      setFourthLevelOptions(["Suboption x", "Suboption y"]);
    }
  }, [thirdLevel]);

  //Handling signup data

  // const handleSignUp = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const response = await fetch("http://localhost:4000/signup", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         username,
  //         email,
  //         password,
  //         firstname: first_name,
  //         lastname: last_name,
  //       }),
  //     });

  //     if (response.ok) {
  //       console.log("User registered successfully");
  //       navigate(`/user/${username}`);
  //     } else {
  //       const errorMessage = await response.text();
  //       setError(`Error signing up: ${errorMessage || response.statusText}`);
  //     }
  //   } catch (error) {
  //     setError(`Error signing up: ${error.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        </div>
        <div className="button-container">
          <button className="button--style">Sign up</button>
        </div>
      </div>
    </>
  );
}
