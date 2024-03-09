import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import Card from "./Card";
import "./Popular.css";
// Import removed for data as it will be fetched from the backend

export default function Popular() {
  const [data, setData] = useState([]);
  const [hotels, setHotels] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        let username = user.username;
        if (username === undefined || username === null) {
          username = "Unknown User";
        }
        console.log("***********", username);

        const response = await fetch(
          "http://localhost:4000/hotel/gettopreviewedtouristspots",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username, // or simply username,
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    // Call the fetchData function
    fetchData();

    const fetchHotels = async () => {
      try {
        let username = user.username;
        if (username === undefined || username === null) {
          username = "Unknown User";
        }
        console.log("***********", username);

        const response = await fetch(
          "http://localhost:4000/hotel/gettopreviewedhotels",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username, // or simply username,
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    // Call the fetchData function
    fetchHotels();
  }, []); // Empty dependency array ensures this runs once after the component mounts

  const temp = data.map((x) => {
    return (
      <Card
        key={x.spot_id}
        image={x.image}
        rating={x.average_rating}
        reviewCount={x.reviewcount}
        location={x.location}
        title={x.name}
        description={x.blog_description}
      />
    );
  });

  const temp1 = hotels.map((x) => {
    return (
      <Card
        key={x.spot_id}
        image={x.photo}
        rating={x.average_rating}
        reviewCount={x.reviewcount}
        location={x.location}
        title={x.name}
        description={x.description}
      />
    );
  });
  return (
    <div>
      <br />
      <p className="top--reviewed">Top Reviewed</p>
      <h1 className="popular--title">
        The amazing places around <span className="bd">Bangladesh</span>
      </h1>
      <section className="card--list">{temp}</section>
      <br />

      <p className="top--reviewed">Top Reviewed</p>
      <h1 className="popular--title">
        Popular accomodations around <span className="bd">Bangladesh</span>
      </h1>
      <section className="card--list">{temp1}</section>
    </div>
  );
}
