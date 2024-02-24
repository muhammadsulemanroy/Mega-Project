import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Box from '@mui/material/Box';
import SeekerandWorkers from '../Assets/seekersandworkers.png';
import "../App.css";
import Image1 from '../Assets/firstImage.jpg';
import Image2 from '../Assets/SecondImage.jpg';
import Image3 from '../Assets/ThirdImage.jpg';
import Image4 from '../Assets/FourthImage.jpg';
import Image5 from '../Assets/FifthImage.jpg';
import Image6 from '../Assets/SixthImage.jpg';

const ServicesSlider = () => {
  const images = [
    Image1,
    Image2,
    Image3,
    Image4,
    Image5,
    Image6,
  ];

  return (
    <Box className='services-slider-top'>
      <Carousel
      infiniteLoop={true}
        transitionTime={1000}
        autoPlay={true}
        interval={4000}
        swipeable={true}
        dynamicHeight={true}
        showArrows={false}
        showStatus={false}
        showThumbs={false}
        emulateTouch={true}
        stopOnHover={false} // Set to false to continue autoplay on hover
        stopOnLastSlide={false} 
    
      >
        {images.map((image, index) => (
          <div key={index} className='services-slider-slide'>
            <div className='overlay'></div>
            <img src={image} alt="" className="testimonial-slider-head" />
          </div>
        ))}
      </Carousel>
      <div className='static-content'>
        <h3>Elevating Lives with Compassionate Services.</h3>
        <br /><br /><br />
        <div className="content-small">
          Welcome to CareSeeker – your one-stop solution for compassionate care services. From expert animal care to gourmet cooking, personalized elderly care, attentive personal care, and dedicated sick care, we've got your diverse needs covered. Find skilled professionals for every aspect of your well-being on our user-friendly platform. CareSeeker, where genuine care meets convenience
        </div>
        <div>
          <img src={SeekerandWorkers} alt="" />
          <h6>We've Helped More Than 1000 of Care Seekers</h6>
        </div>
      </div>
    </Box>
  );
};

export default ServicesSlider;
