import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Popular from "./Popular";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <br />
      <Header />
      <Popular />
    </div>
  );
}
