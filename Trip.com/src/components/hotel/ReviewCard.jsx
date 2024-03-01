import React from "react";
import "./ReviewCard.css";

const ReviewCard = (props) => {
  const data = props.data;

  return (
    <div className="review-card">
      <div className="review-rating">{`Rating: ${data.rating} out of 5`}</div>
      {data.image && (
        <div className="review-image">
          <img src={data.image} alt="Review" />
        </div>
      )}
      <div className="review-comment">{data.comment}</div>
      <div className="review-username">{`- ${data.client_username}`}</div>
    </div>
  );
};

export default ReviewCard;
