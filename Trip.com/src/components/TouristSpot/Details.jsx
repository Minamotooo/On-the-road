import React, { useCallback, useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Navbar from "../HomePage/Navbar";
import {
  API,
  PageHero,
  PhotoCard,
  RatingPicker,
  ReviewItem,
  SectionHead,
  Stars,
  carouselBreakpoints,
  placeName,
} from "../Shared/ui";

const post = (url, body) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

export default function Details() {
  const { spot_id } = useParams();
  const [spotData, setSpotData] = useState(null);
  const [spotReviews, setSpotReviews] = useState([]);
  const [neighboringSpots, setNeighboringSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  // State for posting comments
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [note, setNote] = useState("");

  const fetchReviews = useCallback(async () => {
    const reviewsResponse = await post(`${API}/touristSpotInfo/Reviews/${spot_id}`);
    if (!reviewsResponse.ok) throw new Error(`Fetching reviews failed: ${reviewsResponse.statusText}`);
    const reviews = await reviewsResponse.json();
    setSpotReviews(reviews.sort((a, b) => b.comment_id - a.comment_id));
  }, [spot_id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const spotResponse = await post(`${API}/touristSpotInfo/Details/${spot_id}`);
        if (!spotResponse.ok) throw new Error(`Fetching spot data failed: ${spotResponse.statusText}`);
        const spotRows = await spotResponse.json();
        setSpotData(spotRows[0] || null);

        await fetchReviews();

        const neighboursResponse = await post(
          `${API}/touristSpotInfo/Details/fetchneighboringspots/${spot_id}`
        );
        if (!neighboursResponse.ok)
          throw new Error(`Fetching neighboring spots failed: ${neighboursResponse.statusText}`);
        setNeighboringSpots(await neighboursResponse.json());
        setError(null);
      } catch (err) {
        setError(`Fetching data failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [spot_id, fetchReviews]);

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!comment.trim()) {
      setNote("Write a few words about your visit first.");
      return;
    }
    try {
      const response = await post(`${API}/touristSpot/Reviews/postComment`, {
        rating,
        comment: comment.trim(),
        spot_id,
        username: user.username,
      });
      if (!response.ok) throw new Error(response.statusText);
      setComment("");
      setRating(5);
      setNote("Thanks for sharing your experience!");
      await fetchReviews();
    } catch (err) {
      console.error("Error posting comment:", err);
      setNote("Could not post your comment, please try again.");
    }
  };

  const average =
    spotReviews.length > 0
      ? spotReviews.reduce((sum, r) => sum + Number(r.rating), 0) / spotReviews.length
      : 0;

  return (
    <div className="otr-page">
      <Navbar />
      {loading && !spotData ? (
        <p className="otr-wrap otr-empty">Loading…</p>
      ) : error ? (
        <p className="otr-wrap otr-empty">{error}</p>
      ) : !spotData ? (
        <p className="otr-wrap otr-empty">No data found</p>
      ) : (
        <>
          <PageHero
            kicker={`${placeName(spotData.district_name)}, ${spotData.division_name}`}
            title={spotData.name}
            sub={spotData.blog_description}
            arch={spotData.image}
            pill={neighboringSpots[0]?.image}
          >
            <div className="otr-facts">
              <div>
                <span className="otr-facts__label">Rating</span>
                {average > 0 ? (
                  <>
                    <Stars value={average} /> {average.toFixed(1)} ({spotReviews.length})
                  </>
                ) : (
                  "Not rated yet"
                )}
              </div>
              <div>
                <span className="otr-facts__label">Location</span>
                {`${spotData.union_name}, ${spotData.upazilla_name}`}
              </div>
              <div>
                <span className="otr-facts__label">District</span>
                {placeName(spotData.district_name)}
              </div>
            </div>
          </PageHero>

          <div className="otr-wrap">
            <section className="otr-section">
              <SectionHead kicker="Travellers say" title="Stories from the road" />
              {spotReviews.length === 0 ? (
                <p className="otr-empty">No comments yet. Be the first to share your trip!</p>
              ) : (
                <div className="otr-reviews">
                  {spotReviews.map((review) => (
                    <ReviewItem
                      key={review.comment_id}
                      name={review.client_username}
                      rating={review.rating}
                      date={review.comment_date}
                      text={review.comment_content}
                    />
                  ))}
                </div>
              )}
            </section>

            {user && user.role === "client" && (
              <section className="otr-section">
                <div className="otr-panel">
                  <SectionHead kicker="Been here?" title="Write a comment" small />
                  <form className="otr-form" onSubmit={handleSubmitComment}>
                    <label>Your rating</label>
                    <RatingPicker value={rating} onChange={setRating} />
                    <label htmlFor="comment">Your story</label>
                    <textarea
                      id="comment"
                      value={comment}
                      placeholder="What should the next traveller know?"
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div>
                      <button type="submit" className="otr-btn">
                        Post comment
                      </button>
                    </div>
                    {note && <span className="otr-note">{note}</span>}
                  </form>
                </div>
              </section>
            )}

            {neighboringSpots.length > 0 && (
              <section className="otr-section">
                <SectionHead
                  kicker="While you're there"
                  title={
                    <>
                      More around <span className="bd">{spotData.division_name}</span>
                    </>
                  }
                />
                <Carousel responsive={carouselBreakpoints} className="otr-carousel" showDots>
                  {neighboringSpots.map((neighbour) => (
                    <PhotoCard
                      key={neighbour.spot_id}
                      to={`/touristspot/${neighbour.spot_id}`}
                      image={neighbour.image}
                      title={neighbour.name}
                      rating={neighbour.average_rating}
                      location={placeName(neighbour.district_name)}
                      description={neighbour.blog_description}
                    />
                  ))}
                </Carousel>
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
}
