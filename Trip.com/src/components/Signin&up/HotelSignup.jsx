import React, { useState, useEffect } from "react";

export default function HotelSignup({ onClose }) {
  const [firstLevel, setFirstLevel] = useState('');
  const [secondLevel, setSecondLevel] = useState('');
  const [firstLevelOptions, setFirstLevelOptions] = useState([]);
  const [secondLevelOptions, setSecondLevelOptions] = useState([]);

  // Simulate fetching data from a database
  useEffect(() => {
    // Fetch the first level options
    setFirstLevelOptions(['Option 1', 'Option 2', 'Option 3']);
  }, []);

  useEffect(() => {
    // Reset second level when first level changes
    setSecondLevel('');

    // Fetch second level options based on the first level selection
    if (firstLevel === 'Option 1') {
      setSecondLevelOptions(['Suboption 1.1', 'Suboption 1.2']);
    } else if (firstLevel === 'Option 2') {
      setSecondLevelOptions(['Suboption 2.1', 'Suboption 2.2']);
    } else if (firstLevel === 'Option 3') {
      setSecondLevelOptions(['Suboption 3.1', 'Suboption 3.2']);
    }
  }, [firstLevel]);

  return (
    <>
    <div className="modal-wrapper"></div>

      <div className="modal-container">
        <h1 className="header">Choose Options</h1>
        <button type="button" className="close-button" onClick={onClose}>
          &times;
        </button>

        <div className="input-container">
          <select
            value={firstLevel}
            onChange={e => setFirstLevel(e.target.value)}
            className="input-style"
          >
            <option value="">Select First Level Option</option>
            {firstLevelOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={secondLevel}
            onChange={e => setSecondLevel(e.target.value)}
            className="input-style"
            disabled={!firstLevel}
          >
            <option value="">Select Second Level Option</option>
            {secondLevelOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="button-container">
          <button className="button--style">Submit</button>
          <button className="button--style" onClick={onClose}>Cancel</button>
        </div>
      </div>
      </>

  );
}
