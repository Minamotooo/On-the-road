import React, { useEffect, useState } from "react";
import "./susUsers.css"; // Import the CSS file

export default function Deleted() {
  const [susUsers, setSusUsers] = useState([]);

  useEffect(() => {
    // Fetch sus users data from your API or database using a POST request
    const fetchSusUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/admin/deleteduser",
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
  
  const RestoreAccount = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:4000/admin/restoreuser/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Add any necessary data for the PUT request
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.success) {
          // Remove the user from the sus list
          setSusUsers((prev) => prev.filter((user) => user.username !== username));
        } else {
          console.error("Error restoring user:", responseData.error);
        }
      } else {
        console.error("Error restoring user:", response.statusText);
      }
    } catch (error) {
      console.error("Error restoring user:", error.message);
    }
  };

  return (
    <div className="susUsersContainer">
      <h4>Deleted Users</h4>
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
                onClick={() => RestoreAccount(user.username)}
              >
                Restore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
    