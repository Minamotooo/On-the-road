import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Card from "./Card";
import "./Popular.css";
// Import removed for data as it will be fetched from the backend

export default function Popular() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Function to fetch data
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4000/homepage');
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
    }, []); // Empty dependency array ensures this runs once after the component mounts

 
    const temp = data.map((x)=> { 
        return (
        <Card 
        key ={x.id}
        image={x.coverImg}
        rating= {x.stats.rating}
        reviewCount={x.stats.reviewCount}
        location = {x.location}
        title = {x.title}
        description = {x.description}
    />
        )
    }
    )
    return (
        
        <div>
            <p className="top--reviewed">Top Reviewed</p>
            <h1 className="popular--title">The amazing places around <span className="bd">Bangladesh</span></h1>
            <section className="card--list" >
                {temp}
            </section>
        </div>
    )
}