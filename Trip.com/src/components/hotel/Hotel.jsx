import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../HomePage/Navbar";
import { API, PageHero, SectionHead, postJSON } from "../Shared/ui";
import HotelCard from "./HotelCard";
import SearchBar from "./SearchBar";

export default function Hotel() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [matches, setMatches] = useState(null); // hotel_ids from /hotel/search
  const [division, setDivision] = useState("");
  const navigate = useNavigate();

  const handleHotelClick = (username) => {
    navigate(`/hotel/${username}`);
  };

  useEffect(() => {
    async function fetchHotels() {
      try {
        const response = await postJSON(`${API}/hotel/hotellandingpage`, {});
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        setHotels(await response.json());
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    }
    fetchHotels();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setMatches(null);
      return;
    }
    const controller = new AbortController();
    (async () => {
      try {
        const response = await fetch(`${API}/hotel/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchTerm: searchTerm.trim() }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMatches(new Set(data.map((h) => h.hotel_id)));
      } catch (error) {
        if (error.name !== "AbortError") console.error("Error searching hotels:", error);
      }
    })();
    return () => controller.abort();
  }, [searchTerm]);

  const divisions = useMemo(() => [...new Set(hotels.map((h) => h.division))].sort(), [hotels]);

  const shown = hotels.filter(
    (h) => (!matches || matches.has(h.hotel_id)) && (!division || h.division === division)
  );

  return (
    <div className="otr-page">
      <Navbar />
      <PageHero
        kicker="Stays"
        title="Find a place to rest your feet."
        sub="Diverse lodging options, from lakeside cottages to five-star city hotels."
        arch="/images/hotels/sea-pearl.jpg"
        pill="/images/rooms/deluxe.jpg"
      >
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </PageHero>

      <div className="otr-wrap">
        <section className="otr-section">
          <SectionHead
            kicker={`${shown.length} hotel${shown.length === 1 ? "" : "s"}`}
            title={
              searchTerm.trim() ? (
                `Stays matching “${searchTerm.trim()}”`
              ) : (
                <>
                  Affordable stays to luxury escapes around <span className="bd">Bangladesh</span>
                </>
              )
            }
          />
          <div className="otr-chips" style={{ marginBottom: 24 }}>
            <button
              className={`otr-chip ${division === "" ? "otr-chip--on" : ""}`}
              onClick={() => setDivision("")}
            >
              All divisions
            </button>
            {divisions.map((d) => (
              <button
                key={d}
                className={`otr-chip ${division === d ? "otr-chip--on" : ""}`}
                onClick={() => setDivision(d)}
              >
                {d}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <p className="otr-empty">No hotels found. Try another city or division.</p>
          ) : (
            <div className="otr-grid">
              {shown.map((hotel) => (
                <HotelCard
                  key={hotel.hotel_id}
                  data={hotel}
                  onClick={() => handleHotelClick(hotel.username)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
