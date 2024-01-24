import React from 'react';
import Cards from './Cards';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

// Import images
import img1 from "../images/Curzon_hall_front.jpg";
import img2 from "../images/Sylhet.jpg";
import img3 from "../images/Chittagong.jpg";
import img4 from "../images/Sylhet.jpg";

export default function Division() {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
  
  return (
    <Carousel responsive={responsive}>
      <Cards title="Dhaka" image={img1}/>
      <Cards title="Chittagong" image={img2}/>
      <Cards title="Sylhet" image={img3}/>
      <Cards title="Rajshahi" image={img4}/>
      {/* Add more Card components as needed */}
    </Carousel>
  )
}
