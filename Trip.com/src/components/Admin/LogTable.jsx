import React, { useEffect, useState } from "react";
import "./LogTable.css"; // Import your CSS file for styling

const LogTable = () => {
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    const fetchLogData = async () => {
      try {
        const response = await fetch("http://localhost:4000/admin/logtable", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setLogData(data.data);
        } else {
          console.error("Error fetching log table data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching log table data:", error.message);
      }
    };

    fetchLogData();
  }, [logData]);

  return (
    <div>
      <h4>Log Table</h4>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Calling Time</th>
            <th>Called PL/SQL</th>
            <th>Parameters</th> {/* New column */}
          </tr>
        </thead>
        <tbody>
          {logData.map((row, index) => (
            <tr key={index}>
              <td>{row.username}</td>
              <td>{new Date(row.time_called).toLocaleString()}</td>
              <td>{row.called_plsql}</td>
              <td>{row.calling_parameters}</td> {/* New column */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
