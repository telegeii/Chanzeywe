import React from "react";
import { FaHandHoldingMedical } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";
import { AiFillCar } from "react-icons/ai";
import { IoNutrition } from "react-icons/io5";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProgramFeatured.css";

const NextArrow = ({ onClick }) => (
  <div className="custom-arrow next" onClick={onClick}>
    ❯
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev" onClick={onClick}>
    ❮
  </div>
);

const ProgramFeatured = () => {
  const Program = [
    {
      icon: <FaComputer />,
      ExamBody: "TVET/CDACC",
      Department: "Computer",
      Course: "Information Communication Technology",
    },
    {
      icon: <AiFillCar />,
      ExamBody: "TVET/CDACC",
      Department: "Mechanical & Automotive",
      Course: "Refrigeration & Air Conditioning",
    },
    {
      icon: <FaHandHoldingMedical />,
      ExamBody: "TVET/CDACC",
      Department: "Health Science",
      Course: "Community Health Level",
    },
    {
      icon: <IoNutrition />,
      ExamBody: "TVET/CDACC",
      Department: "Health Science",
      Course: "Nutrition and Dietetics",
    },
  ];

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1, infinite: true },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
  };

  return (
    <section className="Auto">
      <h2 className="title">Featured Courses</h2>
      <div className="Mt20">
        <Slider {...settings}>
          {Program.map((d, index) => (
            <div key={index}>
              <div className="cont">
                <div className="icon">{d.icon}</div>
                <p className="course">{d.Course}</p>
                <p>
                  <strong>Department:</strong> {d.Department}
                </p>
                <p>
                  <strong>Exam Body:</strong> {d.ExamBody}
                </p>
                <button>Enroll Now</button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ProgramFeatured;