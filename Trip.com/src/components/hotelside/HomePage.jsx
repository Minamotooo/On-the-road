import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  const navigate = useNavigate();

  const onExploreTextClick = useCallback(() => {
    // Please sync "Explore" to the project
  }, []);

  const onRoomsTextClick = useCallback(() => {
    // Please sync "Rooms" to the project
  }, []);

  const onAboutTextClick = useCallback(() => {
    // Please sync "About us" to the project
  }, []);

  const onContactTextClick = useCallback(() => {
    // Please sync "contact us" to the project
  }, []);

  const onBtnContainerClick = useCallback(() => {
    // Please sync "Rooms" to the project
  }, []);

  const onLogoClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="homepage">
      <div className="homepage-child" />
      <div className="paradise-view">Paradise View</div>
      <b className="hotel-for-every-container">
        <p className="hotel-for-every">{`Hotel for every `}</p>
        <p className="hotel-for-every">moment rich in</p>
        <p className="hotel-for-every">emotion</p>
      </b>
      <div className="every-moment-feels-container">
        <p className="hotel-for-every">
          Every moment feels like the first time
        </p>
        <p className="hotel-for-every">in paradise view</p>
      </div>
      <div className="book-btn">
        <div className="book-btn-child" />
        <div className="book-now">Book now</div>
      </div>
      <div className="play-btn">
        <div className="play-btn-child" />
        <img className="vector-icon" alt="" src="/vector.svg" />
        <div className="take-a-tour">Take a tour</div>
      </div>
      <img className="homepage-item" alt="" src="/rectangle-5@2x.png" />
      <div className="quick-booking">
        <div className="quick-booking-child" />
        <div className="group-parent">
          <div className="vector-parent">
            <img className="vector-icon1" alt="" src="/vector.svg" />
            <div className="check-in">Check in</div>
            <img className="vector-icon2" alt="" src="/vector.svg" />
            <div className="mar-2023">09 mar 2023</div>
          </div>
          <div className="vector-group">
            <img className="vector-icon3" alt="" src="/vector.svg" />
            <div className="check-out">Check out</div>
            <img className="vector-icon4" alt="" src="/vector.svg" />
            <div className="mar-20231">13 mar 2023</div>
          </div>
          <div className="vector-container">
            <img className="vector-icon5" alt="" src="/vector.svg" />
            <div className="person">Person</div>
            <img className="vector-icon6" alt="" src="/vector.svg" />
            <div className="div">01</div>
          </div>
          <div className="location-parent">
            <div className="location">Location</div>
            <img className="vector-icon7" alt="" src="/vector.svg" />
            <img className="vector-icon8" alt="" src="/vector.svg" />
            <div className="abuja">Abuja</div>
          </div>
          <div className="rectangle-parent">
            <div className="group-child" />
            <div className="book-now1">Book Now</div>
          </div>
          <div className="group-div">
            <img className="vector-icon9" alt="" src="/vector.svg" />
            <div className="room-type">Room type</div>
            <img className="vector-icon10" alt="" src="/vector.svg" />
            <div className="standard">Standard</div>
          </div>
        </div>
      </div>
      <div className="row-2">
        <div className="facility-10">
          <div className="facility-10-child" />
          <div className="game-center-parent">
            <div className="game-center">Game center</div>
            <img className="vector-icon11" alt="" src="/vector.svg" />
          </div>
        </div>
        <div className="facility-11">
          <div className="facility-10-child" />
          <div className="light-parent">
            <div className="light">24/7 Light</div>
            <img className="vector-icon12" alt="" src="/vector.svg" />
          </div>
        </div>
        <div className="facility-12">
          <div className="facility-10-child" />
          <div className="laundry-parent">
            <div className="laundry">Laundry</div>
            <img className="vector-icon13" alt="" src="/vector.svg" />
          </div>
        </div>
        <div className="facility-13">
          <div className="facility-10-child" />
          <div className="parking-space-parent">
            <div className="parking-space">Parking space</div>
            <img className="vector-icon14" alt="" src="/vector.svg" />
          </div>
        </div>
      </div>
      <div className="our-facilities">Our Facilities</div>
      <div className="we-offer-modern">
        We offer modern (5 star) hotel facilities for your comfort.
      </div>
      <img className="hotel-rooms-bg" alt="" src="/hotel-rooms-bg@2x.png" />
      <div className="hotel-rooms-bg-filter" />
      <div className="room-1">
        <div className="room-1-child" />
        <img className="room-1-item" alt="" src="/rectangle-10@2x.png" />
        <div className="avail-btn">
          <div className="avail-btn-child" />
          <div className="rooms-available">
            <b>2</b>
            <b className="rooms-available1"> Rooms available</b>
          </div>
        </div>
      </div>
      <div className="luxurious-rooms">Luxurious Rooms</div>
      <div className="all-room-are">All room are design for your comfort</div>
      <div className="room-2">
        <div className="room-1-child" />
        <img className="room-1-item" alt="" src="/rectangle-10@2x.png" />
        <div className="television-set-extra-container">
          <p className="hotel-for-every">{`Television set, Extra sheets, Breakfast, and `}</p>
          <p className="hotel-for-every">fireplace</p>
        </div>
        <div className="avail-btn1">
          <div className="avail-btn-child" />
          <div className="rooms-available2">
            <b>4</b>
            <b className="rooms-available1"> Rooms available</b>
          </div>
        </div>
      </div>
      <div className="room-3">
        <div className="room-1-child" />
        <img className="room-1-item" alt="" src="/rectangle-10@2x.png" />
        <div className="television-set-extra-container">
          <p className="hotel-for-every">{`Television set, Extra sheets, Breakfast, and `}</p>
          <p className="hotel-for-every">fireplace, Console and bed rest</p>
        </div>
        <div className="avail-btn2">
          <div className="avail-btn-child" />
          <b className="rooms-available4">8 Rooms available</b>
        </div>
      </div>
      <div className="television-set-extra2">
        Television set, Extra sheets and Breakfast
      </div>
      <div className="homepage-inner" />
      <div className="testimonies">Testimonies</div>
      <div className="testimony-1-parent">
        <div className="testimony-1">
          <img className="test-img-icon" alt="" src="/test-img@2x.png" />
          <div className="test-filter" />
          <div className="the-service-at">
            {" "}
            The service at the Hotel Monteleone was exceptional. There was
            absolutely no issue that was not addressed timely and with
            satisfactory results. We were particulary impressed with how the
            hotel staff anticipated our needs (periodically coming by the Board
            Room to check with us). Numerous conference attendees commented on
            the quality of the food, the quality of the service and overall
            positive attitude toward the conference site. Particular noteworthy
            is the longevity of the staff and that sense of investment in the
            success of every event. I usually offer suggestions for improvements
            (part of being a marketing professor), but there is absolutely
            nothing that could be improved – you have set the bar very high.
          </div>
          <div className="mar-20232">2 Mar. 2023</div>
          <img className="testimony-1-child" alt="" src="/ellipse-5@2x.png" />
          <div className="anthony-bruff">Anthony Bruff</div>
          <img className="rating-icon" alt="" src="/rating.svg" />
          <img className="vector-icon15" alt="" src="/vector.svg" />
          <img className="vector-icon16" alt="" src="/vector.svg" />
        </div>
        <div className="testimony-1">
          <img className="test-img-icon" alt="" src="/test-img@2x.png" />
          <div className="test-filter" />
          <div className="the-service-at">
            {" "}
            The service at the Hotel Monteleone was exceptional. There was
            absolutely no issue that was not addressed timely and with
            satisfactory results. We were particulary impressed with how the
            hotel staff anticipated our needs (periodically coming by the Board
            Room to check with us). Numerous conference attendees commented on
            the quality of the food, the quality of the service and overall
            positive attitude toward the conference site. Particular noteworthy
            is the longevity of the staff and that sense of investment in the
            success of every event. I usually offer suggestions for improvements
            (part of being a marketing professor), but there is absolutely
            nothing that could be improved – you have set the bar very high.
          </div>
          <div className="mar-20233">25 Mar. 2023</div>
          <img className="testimony-1-child" alt="" src="/ellipse-5@2x.png" />
          <div className="anthony-bruff">Regina Gella</div>
          <img className="rating-icon" alt="" src="/rating.svg" />
          <img className="vector-icon15" alt="" src="/vector.svg" />
          <img className="vector-icon16" alt="" src="/vector.svg" />
        </div>
        <div className="testimony-1">
          <img className="test-img-icon" alt="" src="/test-img@2x.png" />
          <div className="test-filter" />
          <div className="the-service-at">
            {" "}
            The service at the Hotel Monteleone was exceptional. There was
            absolutely no issue that was not addressed timely and with
            satisfactory results. We were particulary impressed with how the
            hotel staff anticipated our needs (periodically coming by the Board
            Room to check with us). Numerous conference attendees commented on
            the quality of the food, the quality of the service and overall
            positive attitude toward the conference site. Particular noteworthy
            is the longevity of the staff and that sense of investment in the
            success of every event. I usually offer suggestions for improvements
            (part of being a marketing professor), but there is absolutely
            nothing that could be improved – you have set the bar very high.
          </div>
          <div className="mar-20232">5 Apr. 2023</div>
          <img className="testimony-1-child" alt="" src="/ellipse-5@2x.png" />
          <div className="anthony-bruff">Jamiyu Aliyu</div>
          <img className="rating-icon" alt="" src="/rating.svg" />
          <img className="vector-icon15" alt="" src="/vector.svg" />
          <img className="vector-icon16" alt="" src="/vector.svg" />
        </div>
      </div>
      <div className="footer">
        <div className="footer-bg" />
        <div className="paradise-view-parent">
          <b className="paradise-view1">Paradise view</b>
          <b className="the-service-at3">
            The service at the Hotel Monteleone was exceptional. There was
            absolutely no issue that was not addressed timely and with
            satisfactory results. We were particulary impressed with how the
            hotel staff anticipated our needs (periodically coming by the Board
            Room to check with us)
          </b>
        </div>
        <div className="social-media-parent">
          <b className="social-media">Social media</b>
          <b className="facebook">Facebook</b>
          <b className="twitter">Twitter</b>
          <b className="instagram">Instagram</b>
          <b className="linkedin">Linkedin</b>
        </div>
        <div className="company-parent">
          <b className="company">Company</b>
          <b className="privacy-policy">Privacy policy</b>
          <b className="refund-policy">Refund policy</b>
          <b className="faq">F.A.Q</b>
          <b className="about">About</b>
        </div>
        <div className="quick-links-parent">
          <b className="quick-links">Quick links</b>
          <b className="room-booking">Room booking</b>
          <b className="rooms">Rooms</b>
          <b className="contact">Contact</b>
          <b className="explore">Explore</b>
        </div>
        <div className="newsletter-parent">
          <b className="newsletter">Newsletter</b>
          <div className="newsletter-input">
            <div className="newsletter-input-child" />
            <div className="enter-your-email">Enter your email</div>
            <div className="sub-btn">
              <div className="sub-btn-child" />
              <div className="subscribe">Subscribe</div>
            </div>
          </div>
          <b className="kindly-subscribe-to-container">
            <p className="hotel-for-every">
              Kindly subscribe to our newsletter to get
            </p>
            <p className="hotel-for-every">
              latest deals on our rooms and vacation
            </p>
            <p className="hotel-for-every">discount.</p>
          </b>
        </div>
        <div className="footer-child" />
        <div className="paradise-view-2023">Paradise view 2023</div>
      </div>
      <div className="row-1">
        <div className="facility-10">
          <div className="facility-10-child" />
          <div className="swimming-pool-parent">
            <div className="swimming-pool">Swimming Pool</div>
            <img
              className="makiswimming0-icon"
              alt=""
              src="/makiswimming0.svg"
            />
          </div>
        </div>
        <div className="facility-11">
          <div className="facility-10-child" />
          <div className="wifi-parent">
            <div className="wifi">Wifi</div>
            <img className="vector-icon21" alt="" src="/vector.svg" />
          </div>
        </div>
        <div className="facility-12">
          <div className="facility-10-child" />
          <div className="breakfast-parent">
            <div className="breakfast">Breakfast</div>
            <img className="vector-icon12" alt="" src="/vector.svg" />
          </div>
        </div>
        <div className="facility-13">
          <div className="facility-10-child" />
          <div className="gym-parent">
            <div className="gym">Gym</div>
            <img className="vector-icon23" alt="" src="/vector.svg" />
          </div>
        </div>
      </div>
      <div className="navbar">
        <div className="navbar-bg" />
        <div className="nav-links">
          <div className="links">
            <b className="home">Home</b>
            <div className="explore1" onClick={onExploreTextClick}>
              Explore
            </div>
            <div className="rooms1" onClick={onRoomsTextClick}>
              Rooms
            </div>
            <div className="about1" onClick={onAboutTextClick}>
              About
            </div>
            <div className="contact1" onClick={onContactTextClick}>
              Contact
            </div>
          </div>
          <div className="btn" onClick={onBtnContainerClick}>
            <div className="btn-child" />
            <div className="book-now2">Book now</div>
          </div>
          <img
            className="logo-icon"
            alt=""
            src="/logo.svg"
            onClick={onLogoClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
