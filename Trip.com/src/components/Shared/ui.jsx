import React from "react";
import { Link } from "react-router-dom";
import star from "../images/star.png";
import "./otr.css";

export const API = "http://localhost:4000";

// Prices are stored in Taka
export const taka = (amount) =>
  `৳${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const prettyDate = (value) => {
  if (!value) return "";
  const date = new Date(String(value).slice(0, 10) + "T00:00:00");
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

// The district table spells Cox's Bazar as "Coxsbazar"
export const placeName = (name) => (name === "Coxsbazar" ? "Cox's Bazar" : name);

// Same layout as the landing page header: words on the left, the arch photo
// with the little pill photo leaning on it on the right.
export function PageHero({ kicker, title, sub, arch, pill, children }) {
  return (
    <section className="otr-wrap otr-hero">
      <div className="otr-hero__text">
        {kicker && <p className="otr-kicker">{kicker}</p>}
        <h1 className="otr-hero__title">{title}</h1>
        {sub && <p className="otr-hero__sub">{sub}</p>}
        {children}
      </div>
      {arch && (
        <div className="otr-hero__art">
          <img src={arch} alt="" className="otr-arch" />
          {pill && <img src={pill} alt="" className="otr-pill" />}
        </div>
      )}
    </section>
  );
}

export function SectionHead({ kicker, title, small, children }) {
  return (
    <div className="otr-section__head">
      <div>
        {kicker && <p className="otr-kicker">{kicker}</p>}
        <h2 className={`otr-title ${small ? "otr-title--sm" : ""}`}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function Stars({ value }) {
  const rounded = Math.round(Number(value) || 0);
  return (
    <span className="otr-stars" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rounded ? "" : "off"}>
          ★
        </span>
      ))}
    </span>
  );
}

export function RatingPicker({ value, onChange }) {
  return (
    <div className="otr-rate">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          type="button"
          key={i}
          className={i <= value ? "on" : ""}
          onClick={() => onChange(i)}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function Avatar({ name, photo, large }) {
  const cls = `otr-avatar ${large ? "otr-avatar--lg" : ""}`;
  if (photo) return <img src={photo} alt={name} className={cls} />;
  return <span className={cls}>{(name || "?").replace(/[^a-zA-Z]/g, "").slice(0, 1) || "?"}</span>;
}

// Photo card in the style of the landing page cards, a bit roomier
export function PhotoCard({ to, onClick, image, title, rating, reviews, location, description, footer }) {
  const body = (
    <>
      <img src={image} alt={title} className="otr-card__img" loading="lazy" />
      <div className="otr-card__body">
        <h3 className="otr-card__title">{title}</h3>
        <div className="otr-card__meta">
          {rating !== undefined && rating !== null && Number(rating) > 0 && (
            <>
              <img src={star} className="otr-star" alt="" />
              <span>{Number(rating).toFixed(1)}</span>
              {reviews !== undefined && <span className="otr-muted">({reviews})</span>}
              {location && <span className="otr-muted"> • </span>}
            </>
          )}
          {location && <span className="otr-muted">{location}</span>}
        </div>
        {description && <p className="otr-card__desc">{description}</p>}
        {footer && <div className="otr-card__foot">{footer}</div>}
      </div>
    </>
  );
  if (to)
    return (
      <Link to={to} className="otr-card">
        {body}
      </Link>
    );
  return (
    <div className="otr-card" onClick={onClick}>
      {body}
    </div>
  );
}

export function ReviewItem({ name, rating, date, text, image }) {
  return (
    <div className="otr-review">
      <div className="otr-review__who">
        <Avatar name={name} />
        <div>
          <div className="otr-review__name">{name}</div>
          <div className="otr-review__date">{prettyDate(date)}</div>
        </div>
      </div>
      <Stars value={rating} />
      <p>{text}</p>
      {image && <img src={image} alt="" className="otr-review__img" />}
    </div>
  );
}

export function Modal({ title, kicker, onClose, children }) {
  return (
    <div className="otr-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="otr-modal" role="dialog" aria-label={title}>
        <button type="button" className="otr-modal__close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        {kicker && <p className="otr-kicker">{kicker}</p>}
        <h2 className="otr-title otr-title--sm" style={{ marginBottom: 18 }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

export const postJSON = (url, body, method = "POST") =>
  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

export const carouselBreakpoints = {
  desktop: { breakpoint: { max: 4000, min: 1100 }, items: 4, slidesToSlide: 2 },
  laptop: { breakpoint: { max: 1100, min: 800 }, items: 3, slidesToSlide: 1 },
  tablet: { breakpoint: { max: 800, min: 500 }, items: 2, slidesToSlide: 1 },
  mobile: { breakpoint: { max: 500, min: 0 }, items: 1, slidesToSlide: 1 },
};
