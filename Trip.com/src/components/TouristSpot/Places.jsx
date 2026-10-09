import React, { useEffect, useState } from "react";
import Navbar from "../HomePage/Navbar";
import { API, PageHero, PhotoCard, SectionHead, placeName } from "../Shared/ui";
import Division from "./Division";

export default function Places() {
  const [divisions, setDivisions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  // Live search: spots whose name, district or division matches
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const fetchResults = async () => {
      try {
        const response = await fetch(`${API}/touristSpot/home`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchTerm: searchTerm.trim() }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        setResults(await response.json());
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching search results:", error);
          setResults([]);
        }
      }
    };
    fetchResults();
    return () => controller.abort();
  }, [searchTerm]);

  useEffect(() => {
    async function fetchDivisions() {
      try {
        const response = await fetch(`${API}/touristSpot/divisions/all`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        setDivisions(await response.json());
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    }
    fetchDivisions();
  }, []);

  return (
    <div className="otr-page">
      <Navbar />
      <PageHero
        kicker="Explore Bangladesh"
        title="From iconic attractions to hidden gems."
        sub="Hills, haors, mangroves and the longest beach on earth. Your journey begins here."
        arch="/images/spots/sajek.jpg"
        pill="/images/spots/ratargul.jpg"
      >
        <form className="otr-search" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Where do you want to go?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </PageHero>

      <div className="otr-wrap">
        {searchTerm.trim() && (
          <section className="otr-section">
            <SectionHead
              kicker={`${results.length} result${results.length === 1 ? "" : "s"}`}
              title={`Places matching “${searchTerm.trim()}”`}
              small
            />
            {results.length === 0 ? (
              <p className="otr-empty">No spots found. Try a district like Sylhet or Bandarban.</p>
            ) : (
              <div className="otr-grid">
                {results.map((spot) => (
                  <PhotoCard
                    key={spot.spot_id}
                    to={`/touristspot/${spot.spot_id}`}
                    image={spot.image}
                    title={spot.name}
                    rating={spot.average_rating}
                    location={`${placeName(spot.district_name)}, ${spot.division_name}`}
                    description={spot.blog_description}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        <Division divisions={divisions} />
      </div>
    </div>
  );
}
