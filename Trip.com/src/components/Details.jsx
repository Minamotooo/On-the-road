
import { ReactDOM } from "react-dom/client";
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';



export default function Details() {

    const navigate = useNavigate();
  const { spot_id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/touristSpotInfo/${spot_id}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          setError(`Error fetching user data: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Error fetching user data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [spot_id]);

    return(
        <div>
            {/* <h1>{userData.name}</h1>
            <p>{userData.blog_description}</p>
            <p>
                {`${userData.upazilla}, ${userData.district}, ${userData.division}`}
            </p> */}
            <h1>Hello</h1>

            
        </div>
    )
}