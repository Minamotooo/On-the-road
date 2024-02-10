// import React from "react";
// import "../HomePage/page.css";
// import defaultphoto from "../images/hotel-photo.jpg";

// const HotelCard = (props) => {
//   const data = props.data;
//   console.log(data.district);
//   return (
//     <div className="card">
//       <img src={defaultphoto} className="card--image" alt="poster" />

//       <h3 className="card--title">{data.name}</h3>
//       <div className="card--stats">
//         <span className="details">
//           <span className="gray">{data.district}, </span>
//           <span className="gray">{data.division}</span>
//         </span>
//       </div>

//       <p className="card--description">{data.description}n</p>
//       <p className="card--price">
//         <b>From ${data.starting_price}/night</b>
//       </p>
//     </div>
//   );
// };

// export default HotelCard;

// HotelCard.jsx
import React from "react";
import "../HomePage/page.css";
import defaultphoto from "../images/hotel-photo.jpg";

const HotelCard = ({ data, onClick }) => {
  // Accept onClick prop
  return (
    <div className="card" onClick={onClick}>
      {" "}
      {/* Attach onClick to the card */}
      <img src={defaultphoto} className="card--image" alt={data.name} />
      <h3 className="card--title">{data.name}</h3>
      <div className="card--stats">
        <span className="details">
          <span className="gray">{data.district}, </span>
          <span className="gray">{data.division}</span>
        </span>
      </div>
      <p className="card--description">{data.description}</p>
      <p className="card--price">
        <b>From ${data.starting_price}/night</b>
      </p>
    </div>
  );
};

export default HotelCard;
