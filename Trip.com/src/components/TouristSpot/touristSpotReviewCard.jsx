import React from "react";
import "./touristSpotReview.css";

const ReviewCard = (props) => {
  console.log(props);
  const data = props.data;
  return (
    <div className="review-card">
      <div className="review-comment">{data.comment_content}</div>
      <div className="review-username">{`- ${data.client_username}`}</div>
    </div>
  );
};

export default ReviewCard;
