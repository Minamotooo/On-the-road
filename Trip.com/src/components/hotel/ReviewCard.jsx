import React from "react";
import "./ReviewCard.css";

const ReviewCard = (props) => {
  console.log(props);
  return (
    <div className="review-card">
      {/* <div className="review-rating">{`Rating: ${rating} out of 5`}</div>
      <div className="review-comment">{comment}</div>
      <div className="review-username">{`- ${clientUsername}`}</div> */}
    </div>
  );
};

export default ReviewCard;
