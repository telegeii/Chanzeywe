import React from "react";
import "./About.css";
import Photo from "../../assets/Photo1.jpg";
import Mission from "../../assets/mission.png";
import Vision from "../../assets/vision.png";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar";

const About = () => {
  return (
    <div className="about-page">
        <Navbar/>
      {/* Hero Section */}
      <div className="about-hero">
        <img src={Photo} alt="About Chanzeywe" />
        <div className="about-hero-overlay">
          <h1>About Us</h1>
        </div>
      </div>

      {/* About Content */}
      <div className="about-content">
        <h2>About Chanzeywe Vocational Training Institute</h2>
        <p>
          Chanzeywe Vocational Training Institute is committed to delivering
          quality technical and business education that equips learners with
          practical skills for local and international markets.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="about-cards">
        <div className="about-card">
          <img src={Mission} alt="Mission" />
          <h3>Our Mission</h3>
          <p>
            To train and produce responsible, innovative, skilled and
            knowledgeable manpower in technical and business disciplines.
          </p>
        </div>

        <div className="about-card">
          <img src={Vision} alt="Vision" />
          <h3>Our Vision</h3>
          <p>
            To be a center of excellence in innovation, technical training, and
            research.
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default About;