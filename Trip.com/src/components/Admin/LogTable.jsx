import React, { useEffect, useState } from "react";
import { SectionHead } from "../Shared/ui";

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
          setLogData(data.data.sort((a, b) => b.log_id - a.log_id).slice(0, 15));
        } else {
          console.error("Error fetching log table data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching log table data:", error.message);
      }
    };

    fetchLogData();
  }, []);

  return (
    <section className="otr-section">
      <SectionHead kicker="Latest 15 calls" title="PL/pgSQL log" small />
      <table className="otr-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Calling time</th>
            <th>Called PL/SQL</th>
            <th>Parameters</th>
          </tr>
        </thead>
        <tbody>
          {logData.map((row) => (
            <tr key={row.log_id}>
              <td>{row.username}</td>
              <td>{new Date(row.time_called).toLocaleString()}</td>
              <td>
                <code>{row.called_plsql}</code>
              </td>
              <td className="otr-muted">{row.calling_parameters}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default LogTable;
