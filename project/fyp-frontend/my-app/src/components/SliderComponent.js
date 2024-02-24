import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Box from '@mui/material/Box';
import Image1 from '../Assets/sara.png';
import Image2 from '../Assets/james.png';
import Image3 from '../Assets/elizabeth.png';
import "../App.css"

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style,  background: "black" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style,  background: "black" }}
      onClick={onClick}
    />
  );
}

export default class SliderComponent extends Component {
  render() {
    const settings = {
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 4000,
      cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
    };
  

    
    const images = [
      Image1,
      Image2,
      Image3,
      
    ];
    const text = [
      'At CareSeeker, our experience has been nothing short of exceptional. As a bustling hub for compassionate care services, CareSeekr goes beyond the ordinary to provide a seamless platform connecting communities with dedicated support workers. We found solace in their web-based project, a service-oriented  for those seeking assistance in various facets of life',
      'The websites category system makes it incredibly easy to find the specific support needed, whether its for baby care, cooking, personal care, animal care, or even a gym instructor. Posting a job as a care seeker was a breeze, with options to specify services, provide details, and set a reasonable hourly budget. The messaging service streamlined communication',
      'I recently had the pleasure of using the Care Seeker website to find a support worker for my elderly parent, and the experience exceeded my expectations. The registration process for support workers was comprehensive, ensuring that I had access to all the necessary information to make an informed about decision. The inclusion of pictures, hourly rates, experience ',
    ];
    const name = [
      'Sara',
      'James',
      'Elizabeth',
    ];

    
    return (
      <>
        <Box className='slider-top'>
        <Slider className='slider' {...settings}>
          {images.map((image, index) => (
             <>
             <Box className='slider-image-top'>
              <img src={image} alt="" className="testimonial-slider-head" />
             </Box>
             <Box className='slider-paragraph-top' >
              <p className="slider-paragraph">{text[index]}</p>
             </Box>
             <Box className='slider-name-top' >
              <p className="slider-name">{name[index]}</p>
              </Box>
              </>
          ))}
        </Slider>
      </Box>
      </>
    );
  }
}
