import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../HomePage/Navbar";
import HotelCard from "./HotelCard";
import SearchBar from "./SearchBar";

export default function Hotel() {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  const handleHotelClick = (username) => {
    // Directly navigate to the hotel's detail page
    navigate(`/hotel/${username}`);
  };

  useEffect(() => {
    // Function to fetch hotels data
    async function fetchHotels() {
      try {
        // Make a POST request to your backend endpoint
        const response = await fetch(
          "http://localhost:4000/hotel/hotellandingpage",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Include other headers like authorization if needed
            },
            body: JSON.stringify({
              // Include any body content required by your POST endpoint, if necessary
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Set the hotels data to state
        setHotels(data);
        //console.log(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    }

    // Call the fetchHotels function
    fetchHotels();
  }, []); // The empty array as a second argument ensures useEffect runs once after initial render

  return (
    <div>
      <Navbar />
      <SearchBar />
      <h2 className="card--list">
        Diverse lodging options, affordable accommodations to luxury stays
      </h2>
      <section className="card--list">
        {hotels.map(
          (
            hotel // Remove index if not needed, use unique property like hotel.id as a key
          ) => (
            <HotelCard
              key={hotel.hotel_id} // It's best practice to use unique ID rather than index
              data={hotel}
              onClick={() => handleHotelClick(hotel.username)}
            />
          )
        )}
      </section>
    </div>
  );
}
