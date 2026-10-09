import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Navbar from "../HomePage/Navbar";
import { API, PageHero, PhotoCard, SectionHead, placeName, postJSON } from "../Shared/ui";

const priceLabel = { $: "Budget", $$: "Mid-range", $$$: "Fine dining" };

// Public page of a restaurant; its owner lands here after signing in
export default function RestaurantDashboard() {
  const { username } = useParams();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const response = await postJSON(`${API}/restaurant/profile/${username}`);
        if (!response.ok) {
          setNotFound(true);
          return;
        }
        const data = await response.json();
        setRestaurant(data);
        const others = await postJSON(`${API}/restaurant/search`, { division: data.division });
        if (others.ok) {
          setNearby((await others.json()).filter((r) => r.username !== username).slice(0, 4));
        }
      } catch (error) {
        console.error("Error loading restaurant:", error);
      }
    })();
  }, [username]);

  const isOwner = user && user.role === "restaurant" && user.username === username;

  return (
    <div className="otr-page">
      <Navbar />
      {notFound && <p className="otr-wrap otr-empty">We couldn't find that restaurant.</p>}
      {restaurant && (
        <>
          <PageHero
            kicker={isOwner ? "Your restaurant" : `${placeName(restaurant.district)}, ${restaurant.division}`}
            title={restaurant.name}
            sub={restaurant.description}
            arch={restaurant.image}
            pill={nearby[0]?.image}
          >
            <div className="otr-facts">
              <div>
                <span className="otr-facts__label">Cuisine</span>
                {restaurant.cuisine}
              </div>
              <div>
                <span className="otr-facts__label">Price</span>
                {restaurant.price_point} · {priceLabel[restaurant.price_point]}
              </div>
              <div>
                <span className="otr-facts__label">Address</span>
                {[restaurant.plot_no, restaurant.road_name].filter(Boolean).join(", ")},{" "}
                {placeName(restaurant.district)} {restaurant.zip_code}
              </div>
              <div>
                <span className="otr-facts__label">Contact</span>
                {restaurant.phone_no} · {restaurant.email}
              </div>
            </div>
            <Link to="/restaurant" className="otr-btn" style={{ textDecoration: "none" }}>
              More restaurants
            </Link>
          </PageHero>

          {nearby.length > 0 && (
            <div className="otr-wrap">
              <section className="otr-section">
                <SectionHead
                  kicker="Hungry for more?"
                  title={
                    <>
                      More to eat in <span className="bd">{restaurant.division}</span>
                    </>
                  }
                />
                <div className="otr-grid">
                  {nearby.map((r) => (
                    <PhotoCard
                      key={r.restaurant_id}
                      to={`/Restaurant/${r.username}`}
                      image={r.image}
                      title={r.name}
                      location={`${placeName(r.district)} · ${r.cuisine}`}
                      description={r.description}
                      footer={<b>{r.price_point}</b>}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
}
