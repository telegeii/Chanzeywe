import React from "react";
import "./Principal.css";
import PrincipalPhoto from "../../assets/Photo4.jpg";

const Principal = () => {
  return (
    <section className="principal-section">

      <div className="principal-blob principal-blob--1" />
      <div className="principal-blob principal-blob--2" />

      <div className="principal-container">

        {/* IMAGE */}
        <div className="principal-image-wrap">

          <div className="principal-image-frame">
            <img src={PrincipalPhoto} alt="Mr. Gilbert G. Mwavali – Principal" />
          </div>

          <div className="principal-badge">
            <span className="principal-badge__icon">✦</span>
            <span>Since 2020</span>
          </div>

        </div>

        {/* MESSAGE */}
        <div className="principal-content">

          <div className="principal-label">
            <span className="principal-label__line" />
            <span>Principal's Message</span>
          </div>

          <blockquote className="principal-quote">
            A heartfelt welcome to the digital home of Chanzeywe Institute.
            We are committed to academic excellence, innovation, and the
            development of skilled professionals ready to thrive in the
            modern technological world.
          </blockquote>

          <div className="principal-divider" />

          <div className="principal-signature">
            <p className="principal-karibu">~ Karibu</p>
            <h3 className="principal-name">Mr. Gilbert G. Mwavali</h3>
            <span className="principal-title">Principal / Secretary – B.O.G</span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Principal;