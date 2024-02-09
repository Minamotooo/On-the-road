
import "./style.css";
import defaultphoto from "../images/hotel-photo.jpg"

const HotelCard = (props) => {
  return (
          <div className="this-card">
            <img className="image" src={defaultphoto} />
            <div className="location-dates">
              <div className="info">
                <div className="line-1">{props.name}</div>
                <div className="dates">Yosemite National Park</div>
                <div className="dates">Oct 23 - 28</div>
              </div>
              <div className="price">
                <div className="dates">
                  <span className="span">$289</span>
                  <span className="night1"> night</span>
                </div>
              </div>
            </div>
            </div>
    
  );
};

export default HotelCard;
