// App.jsx

import React from "react";
import { Route, Routes } from "react-router-dom";  // Updated import statement
import SignIn from "./Routes/SignIn";
import SignUp from "./Routes/SignUp";
import UserProfile from "./Routes/UserProfile";
import UpdateProfile from "./Routes/UpdateProfile";
import "./Routes/SignIn.css";

const App = () => {
  return (
    <div>
      <h1 className="header">Trip.com</h1>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user/:username" element={<UserProfile />} />
        <Route path="/update/:username" element={<UpdateProfile />} />
        
        {/* Add more routes as needed */}
        
      </Routes>
    </div>
  );
};

export default App;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import SearchBar from './Routes/Searchbar';
// import TouristSpots from './Routes/TouristSpot';

// function App() {
//   // const [touristSpots, setTouristSpots] = useState([]);
//   // const [searchTerm, setSearchTerm] = useState('');

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     const response = await axios.get('your-backend-endpoint', {
//   //       params: { search: searchTerm }
//   //     });
//   //     setTouristSpots(response.data);
//   //   };

//   //   if (searchTerm === '') {
//   //     // Fetch default spots
//   //     fetchData();
//   //   }
//   // }, [searchTerm]);

//   // const handleSearch = (search) => {
//   //   setSearchTerm(search);
//   // };

//   return (
//     <div className="App">
//       <SearchBar  />
//     </div>
//   );
// }

// export default App;
