import React, { useEffect, useState } from "react";
import { Avatar, SectionHead } from "../Shared/ui";

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
    <section className="otr-section">
      <SectionHead kicker="Archived by trigger" title="Deleted accounts" small />
      {susUsers.length === 0 ? (
        <p className="otr-empty">No deleted accounts.</p>
      ) : (
        <div className="otr-chips">
          {susUsers.map((user) => (
            <div key={user.username} className="otr-panel" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px" }}>
              <Avatar name={user.username} photo={user.profile_photo} />
              <span className="otr-review__name">{user.username}</span>
              <button className="otr-btn otr-btn--small" onClick={() => RestoreAccount(user.username)}>
                Restore
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
    