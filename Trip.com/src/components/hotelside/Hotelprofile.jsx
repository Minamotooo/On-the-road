import React from 'react';
import './hotel.css'; // We'll create this CSS file next
import Navbar from '../HomePage/Navbar';
import Body from './Body';
import RoomSelection from './RoomSection';
import Homepage from './HomePage';
export default function HotelProfile() {
  return (
    <>
    <Navbar />
    <Body />
    <RoomSelection />
    </>
  );
}

