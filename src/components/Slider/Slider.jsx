import React, { useEffect, useState, useRef } from "react";
import "./Slider.css";

const Slider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [direction, setDirection] = useState("next");
  const [isAnimating, setIsAnimating] = useState(false);

  const intervalRef = useRef(null);

  const goTo = (index, dir = "next") => {
    if (isAnimating || index === currentIndex) return;

    setDirection(dir);
    setPrevIndex(currentIndex);
    setIsAnimating(true);
    setCurrentIndex(index);

    setTimeout(() => {
      setPrevIndex(null);
      setIsAnimating(false);
    }, 1000);
  };

  const goNext = () => {
    const next = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    goTo(next, "next");
  };

  const goPrev = () => {
    const prev = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    goTo(prev, "prev");
  };

  /* AUTOPLAY FIX */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(intervalRef.current);
  }, [slides.length]);

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goNext, 6000);
  };

  const handleDot = (i) => {
    const dir = i > currentIndex ? "next" : "prev";
    goTo(i, dir);
    resetInterval();
  };

  const handleArrow = (fn) => {
    fn();
    resetInterval();
  };

  return (
    <div className="slider">

      {slides.map((slide, i) => {

        let className = "slide";
        if (i === currentIndex) className += " slide--active";
        else if (i === prevIndex) className += " slide--exit";
        else className += " slide--hidden";

        return (
          <div key={i} className={className}>

            <div
              className="slide__bg"
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            <div className="slide__overlay" />

            <div className="slide__content">

              {slide.eyebrow && (
                <span className="slide__eyebrow">{slide.eyebrow}</span>
              )}

              <h1 className="slide__title">{slide.text}</h1>

              {slide.subtitle && (
                <p className="slide__subtitle">{slide.subtitle}</p>
              )}

              {slide.cta && (
                <button className="slide__cta">{slide.cta}</button>
              )}

            </div>
          </div>
        );
      })}

      {/* ARROWS */}

      <button
        className="slider__arrow slider__arrow--prev"
        onClick={() => handleArrow(goPrev)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        className="slider__arrow slider__arrow--next"
        onClick={() => handleArrow(goNext)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* DOTS */}

      <div className="slider__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`slider__dot ${i === currentIndex ? "slider__dot--active" : ""}`}
            onClick={() => handleDot(i)}
          />
        ))}
      </div>

      {/* PROGRESS BAR */}

      <div className="slider__progress" key={currentIndex}>
        <div className="slider__progress-bar" />
      </div>

    </div>
  );
};

export default Slider;