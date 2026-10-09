import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../HomePage/Navbar";
// Restaurant.css also carries the site-wide body font and #f4f4f4 background
import "./Restaurant.css";
import { API, PageHero, SectionHead, placeName, postJSON } from "../Shared/ui";
import RestaurantSearchBar from "./RestaurantSearchBar";

const priceranges = ["$", "$$", "$$$"];
const priceLabel = { $: "Budget", $$: "Mid-range", $$$: "Fine dining" };

const Restaurant = () => {
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await postJSON(`${API}/hotelSignUp/divisions`, { message: "Get divisions" });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setDivisions(data.success ? data.data.map((division) => division.name) : []);
      } catch (err) {
        setError(`Error getting division: ${err.message}`);
      }
    };
    fetchDivisions();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${API}/restaurant/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            division: selectedDivision,
            priceRange: selectedPriceRange,
            searchTerm: searchTerm.trim(),
          }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setRestaurants(data.sort((a, b) => a.name.localeCompare(b.name)));
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") setError(`Error getting restaurants: ${err.message}`);
      }
    };
    fetchRestaurants();
    return () => controller.abort();
  }, [selectedDivision, selectedPriceRange, searchTerm]);

  return (
    <div className="otr-page">
      <Navbar />
      <PageHero
        kicker="Taste of Bangladesh"
        title="Eat like the locals do."
        sub="From Old Dhaka biryani to Chattogram mezbani and Sylhet's endless bhorta."
        arch="/images/food/haji-biryani.jpg"
        pill="/images/food/kacchi.jpg"
      >
        <RestaurantSearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </PageHero>

      <div className="otr-wrap">
        <section className="otr-section">
          <SectionHead
            kicker={`${restaurants.length} restaurant${restaurants.length === 1 ? "" : "s"}`}
            title={
              <>
                Top-notch restaurants around <span className="bd">Bangladesh</span>
              </>
            }
          />

          <div className="otr-chips" style={{ marginBottom: 12 }}>
            <button
              className={`otr-chip ${selectedDivision === "" ? "otr-chip--on" : ""}`}
              onClick={() => setSelectedDivision("")}
            >
              All divisions
            </button>
            {divisions.map((division) => (
              <button
                key={division}
                className={`otr-chip ${selectedDivision === division ? "otr-chip--on" : ""}`}
                onClick={() => setSelectedDivision(division)}
              >
                {division}
              </button>
            ))}
          </div>
          <div className="otr-chips" style={{ marginBottom: 26 }}>
            <button
              className={`otr-chip ${selectedPriceRange === "" ? "otr-chip--on" : ""}`}
              onClick={() => setSelectedPriceRange("")}
            >
              Any price
            </button>
            {priceranges.map((price) => (
              <button
                key={price}
                className={`otr-chip ${selectedPriceRange === price ? "otr-chip--on" : ""}`}
                onClick={() => setSelectedPriceRange(price)}
              >
                {price} · {priceLabel[price]}
              </button>
            ))}
          </div>

          {error && <p className="otr-note">{error}</p>}
          {restaurants.length === 0 ? (
            <p className="otr-empty">No restaurants match these filters yet.</p>
          ) : (
            <div className="otr-grid">
              {restaurants.map((restaurant) => (
                <Link
                  key={restaurant.restaurant_id}
                  to={`/Restaurant/${restaurant.username}`}
                  className="otr-card"
                >
                  <img src={restaurant.image} alt={restaurant.name} className="otr-card__img" loading="lazy" />
                  <div className="otr-card__body">
                    <h3 className="otr-card__title">{restaurant.name}</h3>
                    <div className="otr-card__meta">
                      <span className="otr-muted">
                        {placeName(restaurant.district)}, {restaurant.division}
                      </span>
                    </div>
                    <p className="otr-card__desc">{restaurant.description}</p>
                    <div className="otr-card__foot">
                      <span className="otr-tag" style={{ margin: 0 }}>
                        {restaurant.cuisine}
                      </span>
                      <b title={priceLabel[restaurant.price_point]}>{restaurant.price_point}</b>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Restaurant;
