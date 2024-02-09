import React from 'react';
import './RoomSelection.css'; // Make sure to create this CSS file

const RoomSelection = () => {
  return (
    <div className="room-selection">
      <div className="room-details">
        <div className="room-images">
          <img src="path_to_your_image" alt="Room" />
          {/* Additional thumbnails */}
        </div>
        <div className="room-info">
          <h3>King Room</h3>
          <ul>
            <li>1 king bed</li>
            <li>Non-smoking</li>
            <li>Wi-Fi (additional charge)</li>
            {/* Add more room features */}
          </ul>
        </div>
      </div>
      <div className="room-choices">
        <div className="price-box">
          <span>Today's best price</span>
          <div className="price">$113</div>
          <button>Reserve</button>
        </div>
        <div className="price-inclusions">
          {/* List any inclusions like breakfast */}
        </div>
      </div>
    </div>
  );
};

export default RoomSelection;
