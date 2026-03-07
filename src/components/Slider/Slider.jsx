import React, { useEffect, useState, useRef } from "react";
import "./Slider.css";

import Image1 from "../../assets/Photo1.jpg";
import Image2 from "../../assets/Photo2.jpg";
import Image3 from "../../assets/Photo3.jpg";

/* ─────────────────────────────────────────────
   Default slides — replace with data from your
   admin/backend once connected.
   Each slide: { image, eyebrow?, text, subtitle?, cta? }
───────────────────────────────────────────── */
const DEFAULT_SLIDES = [
  {
    image:    Image1,
    eyebrow:  "Welcome to Chanzeywe TVC",
    text:     "Skills to Transform Livelihoods",
    subtitle: "Quality CDACC-accredited vocational training for Kenya's growing economy.",
    cta:      "Explore Courses",
  },
  {
    image:    Image2,
    eyebrow:  "CDACC Accredited",
    text:     "Nationally Recognised Programmes",
    subtitle: "Certificates, diplomas and artisan programmes across 6 departments.",
    cta:      "View Departments",
  },
  {
    image:    Image3,
    eyebrow:  "Intakes Now Open",
    text:     "January 2026 Intake Now Open",
    subtitle: "Apply early — intakes run in January, May, and September every year.",
    cta:      "Apply Now",
  },
];

/* ─────────────────────────────────────────────
   Slider Component
   Props:
     slides — optional. Falls back to DEFAULT_SLIDES.
───────────────────────────────────────────── */
const Slider = ({ slides = DEFAULT_SLIDES }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex,    setPrevIndex]    = useState(null);
  const [direction,    setDirection]    = useState("next");
  const [isAnimating,  setIsAnimating]  = useState(false);
  const intervalRef = useRef(null);

  const goTo = (index, dir = "next") => {
    if (isAnimating || index === currentIndex) return;
    setDirection(dir);
    setPrevIndex(currentIndex);
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => { setPrevIndex(null); setIsAnimating(false); }, 900);
  };

  const goNext = () => {
    const next = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    goTo(next, "next");
  };

  const goPrev = () => {
    const prev = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    goTo(prev, "prev");
  };

  /* Autoplay */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => prev === slides.length - 1 ? 0 : prev + 1);
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [slides.length]);

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goNext, 6000);
  };

  const handleDot   = (i) => { goTo(i, i > currentIndex ? "next" : "prev"); resetInterval(); };
  const handleArrow = (fn) => { fn(); resetInterval(); };

  return (
    <div className="slider">

      {slides.map((slide, i) => {
        let cls = "slide";
        if      (i === currentIndex) cls += " slide--active";
        else if (i === prevIndex)    cls += direction === "next" ? " slide--exit" : " slide--exit-rev";
        else                         cls += " slide--hidden";

        return (
          <div key={i} className={cls}>

            {/* BG image */}
            <div className="slide__bg" style={{ backgroundImage:`url(${slide.image})` }} />

            {/* Gradient overlay */}
            <div className="slide__overlay" />

            {/* Content */}
            <div className="slide__content">
              {slide.eyebrow && <span className="slide__eyebrow">{slide.eyebrow}</span>}
              <h1 className="slide__title">{slide.text}</h1>
              {slide.subtitle && <p className="slide__subtitle">{slide.subtitle}</p>}
              {slide.cta && <button className="slide__cta">{slide.cta}</button>}
            </div>

          </div>
        );
      })}

      {/* Arrows */}
      <button className="slider__arrow slider__arrow--prev" onClick={() => handleArrow(goPrev)} aria-label="Previous slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button className="slider__arrow slider__arrow--next" onClick={() => handleArrow(goNext)} aria-label="Next slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="slider__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`slider__dot${i === currentIndex ? " slider__dot--active" : ""}`}
            onClick={() => handleDot(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="slider__progress" key={currentIndex}>
        <div className="slider__progress-bar" />
      </div>

    </div>
  );
};

export default Slider;