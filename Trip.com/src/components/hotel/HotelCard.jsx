import React from "react";
import defaultphoto from "../images/hotel-photo.jpg";
import { PhotoCard, placeName, taka } from "../Shared/ui";

const HotelCard = ({ data, onClick }) => (
  <PhotoCard
    onClick={onClick}
    image={data.photo ? data.photo : defaultphoto}
    title={data.name}
    rating={data.average_rating}
    location={`${placeName(data.district)}, ${data.division}`}
    description={data.description}
    footer={
      data.starting_price && (
        <span className="otr-price">
          From <b>{taka(data.starting_price)}</b>
          <span className="otr-muted"> / night</span>
        </span>
      )
    }
  />
);

export default HotelCard;
