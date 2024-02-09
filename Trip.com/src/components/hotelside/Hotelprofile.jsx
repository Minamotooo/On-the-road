import React from 'react';
import './hotel.css';

function HotelProfile() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>Booking Hotel</h1>
          <p>The Best Place to Stay</p>
          <button>Book Now</button>
        </div>
      </header>
      <main>
        <section className="section-1">
          <div className="section-1-content">
            <h2>Luxury Experience</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut commodo
              odio et arcu laoreet, a bibendum odio mollis.
            </p>
            <button>Learn More</button>
          </div>
          <div className="section-1-image"></div>
        </section>
        <section className="section-2">
          <div className="section-2-content">
            <h2>Rooms & Suites</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut commodo
              odio et arcu laoreet, a bibendum odio mollis.
            </p>
            <button>Explore Rooms</button>
          </div>
          <div className="section-2-image"></div>
        </section>
        <section className="section-3">
          <div className="section-3-content">
            <h2>Facilities</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut commodo
              odio et arcu laoreet, a bibendum odio mollis.
            </p>
            <button>Discover More</button>
          </div>
          <div className="section-3-image"></div>
        </section>
      </main>
      <footer className="App-footer">
        <p>&copy; 2023 Booking Hotel</p>
      </footer>
    </div>
  );
}

export default HotelProfile;