import React, { useEffect, useState } from "react";
import "./susUsers.css"; // Import the CSS file

const SusUsers = () => {
  const [susUsers, setSusUsers] = useState([]);

  useEffect(() => {
    // Fetch sus users data from your API or database using a POST request
    const fetchSusUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/admin/showsususer",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // Add any necessary data for the POST request
              key: "value",
            }),
          }
        );

        console.log(response);

        if (response.ok) {
          const responseData = await response.json();

          // Check if the data has a 'data' property and it's an array
          if (responseData.success && Array.isArray(responseData.data)) {
            setSusUsers(responseData.data);
          } else {
            console.error(
              "Invalid data structure received from the server:",
              responseData
            );
          }
        } else {
          console.error("Error fetching sus users data");
        }
      } catch (error) {
        console.error("Error fetching sus users data:", error.message);
      }
    };

    fetchSusUsers();
  }, []); // Add any dependencies if needed

  const removeFromSusList = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:4000/admin/removeFromSusList/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Add any necessary data for the PUT request
            key: "value",
          }),
        }
      );
  
      if (response.ok) {
        // Update the state or trigger a re-fetch
        const updatedSusUsers = susUsers.filter((user) => user.username !== username);
        setSusUsers(updatedSusUsers);
      } else {
        console.error("Error removing user from suspicious list");
      }
    } catch (error) {
      console.error("Error removing user from suspicious list:", error.message);
    }
  };
  
  return (
    <div className="susUsersContainer">
      <h4>Suspicious Users</h4>
      <div className="userList">
        {susUsers.map((user) => (
          <div key={user.id} className="userCard">
            <img
              src={user.profile_photo}
              alt={`Profile of ${user.username}`}
              className="img"
            />
            <div className="userInfo">
              <h5 className="username">{user.username}</h5>
              <button
                className="button--style btn"
                onClick={() => removeFromSusList(user.username)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SusUsers;
