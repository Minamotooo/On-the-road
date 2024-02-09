import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Navbar from "../HomePage/Navbar";
import HotelCard from "./HotelCard";

export default function Hotel() {
    const [hotels, setHotels] = useState([]); // Initialize the state to hold the hotels data

    useEffect(() => {
        // Function to fetch hotels data
        async function fetchHotels() {
            try {
                // Make a POST request to your backend endpoint
                const response = await fetch('/hotellandingpage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include other headers like authorization if needed
                    },
                    body: JSON.stringify({
                        // Include any body content required by your POST endpoint, if necessary
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Parse the JSON response
                const data = await response.json();

                // Set the hotels data to state
                setHotels(data);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            }
        }

        // Call the fetchHotels function
        fetchHotels();
    }, []); // The empty array as a second argument ensures useEffect runs once after initial render

    return (
        <>
            <Navbar />
            <div className="relative-container">
                <SearchBar />
                {hotels.map((hotel, index) => (
                    <HotelCard key={index} data={hotel} /> // Pass each hotel's data as a prop to HotelCard
                ))}
            </div>
        </>
    );
}
