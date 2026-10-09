import React from "react";
import { ReviewItem } from "../Shared/ui";

const ReviewCard = ({ data }) => (
  <ReviewItem
    name={data.client_username}
    rating={data.rating}
    date={data.review_date}
    text={data.comment}
    image={data.image}
  />
);

export default ReviewCard;
