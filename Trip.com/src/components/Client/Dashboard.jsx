import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../HomePage/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();

  const goToHomepage = () => {
    navigate("/");
  };

  return (
    <div>
      <Navbar />
      <h1>USER DASHBOARD </h1>
      <button onClick={goToHomepage}>Go to homepage</button>
    </div>
  );
}
