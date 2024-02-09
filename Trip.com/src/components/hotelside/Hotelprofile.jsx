import React from 'react';
import './hotel.css'; // We'll create this CSS file next
import Navbar from '../HomePage/Navbar';
import Body from './Body';
import RoomSelection from './RoomSection';
export default function HotelProfile() {
  return (
    <>
    <Navbar />
    <Body />
    <RoomSelection />
    </>
  );
}

