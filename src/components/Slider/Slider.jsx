import React, { useEffect, useState } from "react";
import "./Slider.css";
const Slider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // AUTO SLIDE EVERY 5 SECONDS
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="slider">
      <img
        src={slides[currentIndex].image}
        alt="slider"
        className="slider-image"
      />

      <div className="overlay">
        <h1>{slides[currentIndex].text}</h1>
      </div>
    </div>
  );
};

export default Slider;