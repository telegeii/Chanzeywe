import React from "react";
import "./Principal.css";
import PrincipalPhoto from "../../assets/Photo4.jpg";

const DEFAULTS = {
  name: "Mr. Gilbert G. Mwavali",
  title: "Principal / Secretary – B.O.G",
  greeting: "Karibu",
  message:
    "A heartfelt welcome to the digital home of Chanzeywe Institute. We are committed to academic excellence, innovation, and the development of skilled professionals ready to thrive in the modern technological world.",
  photo: null,
};

/** `data` — optional, fetched by Home.jsx from /api/principal.php. Falls back to the current copy while loading or if the fetch fails. */
const Principal = ({ data }) => {
  const p = data || DEFAULTS;

  return (
    <section className="principal-section">

      <div className="principal-blob principal-blob--1" />
      <div className="principal-blob principal-blob--2" />

      <div className="principal-container">

        {/* IMAGE */}
        <div className="principal-image-wrap">

          <div className="principal-image-frame">
            <img src={p.photo || PrincipalPhoto} alt={`${p.name} – Principal`} />
          </div>

        </div>

        {/* MESSAGE */}
        <div className="principal-content">

          <div className="principal-label">
            <span className="principal-label__line" />
            <span>Principal's Message</span>
          </div>

          <blockquote className="principal-quote">
            {p.message}
          </blockquote>

          <div className="principal-divider" />

          <div className="principal-signature">
            <p className="principal-karibu">~ {p.greeting}</p>
            <h3 className="principal-name">{p.name}</h3>
            <span className="principal-title">{p.title}</span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Principal;