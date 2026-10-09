import React, { useEffect, useState } from "react";
import { Avatar, SectionHead } from "../Shared/ui";

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
        const updatedSusUsers = susUsers.filter(
          (user) => user.username !== username
        );
        setSusUsers(updatedSusUsers);
      } else {
        console.error("Error removing user from suspicious list");
      }
    } catch (error) {
      console.error("Error removing user from suspicious list:", error.message);
    }
  };

  return (
    <section className="otr-section">
      <SectionHead kicker="Flagged by the database" title="Suspicious users" small />
      {susUsers.length === 0 ? (
        <p className="otr-empty">Nobody is flagged right now.</p>
      ) : (
        <div className="otr-chips">
          {susUsers.map((user) => (
            <div key={user.username} className="otr-panel" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px" }}>
              <Avatar name={user.username} photo={user.profile_photo} />
              <span className="otr-review__name">{user.username}</span>
              <button className="otr-btn otr-btn--small" onClick={() => removeFromSusList(user.username)}>
                Unmark
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SusUsers;
