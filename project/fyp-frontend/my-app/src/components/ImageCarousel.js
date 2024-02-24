import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';


const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); // Change image every 3 seconds

    return () => clearInterval(intervalId);
  }, [images]);

  return (
    <>
      {images.map((image, index) => (
        <CSSTransition
          key={index}
          in={index === currentIndex}
          timeout={500}
          classNames="image"
          unmountOnExit
        >
          <img src={image} className="image-carousel" alt={`Slide ${index}`} />
        </CSSTransition>
      ))}
      </>
  );
};

export default ImageCarousel;
