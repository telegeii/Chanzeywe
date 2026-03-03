import React from "react";
import "./Principal.css";
import PrincipalPhoto from "../../assets/Photo4.jpg";
const Principal = () => {
  return (
    <section className="principal-section">
      <div className="principal-container">
        
        {/* LEFT: IMAGE */}
        <div className="principal-image">
          <img src={PrincipalPhoto} alt="Principal" />
        </div>

        {/* RIGHT: MESSAGE */}
        <div className="principal-content">
          <p className="principal-quote">
            “A heartfelt welcome to the digital home of Chanzeywe Institute.
            We are committed to academic excellence, innovation, and the
            development of skilled professionals ready to thrive in the modern
            technological world.”
          </p>

          <p className="principal-karibu">~ Karibu</p>

          <h3 className="principal-name">Mr. Gilbert G. Mwavali</h3>
          <span className="principal-title">
            Principal / Secretary – B.O.G
          </span>
        </div>

      </div>
    </section>
  );
};

export default Principal;