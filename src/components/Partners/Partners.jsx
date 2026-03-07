import React from "react";
import "./Partner.css";

import Tveta from "../../assets/tveta.png";
import Vibrant from "../../assets/Vibrant.jpeg";
import Cdacc from "../../assets/CDACC.png";
import Nita from "../../assets/nita.jpg";
import Moe from "../../assets/Moe.png";
import Kuccps from "../../assets/kuccps.jpg";
import Knqa from "../../assets/KNQA.png";
import Knec from "../../assets/KNEC.jpg";
import Helb from "../../assets/helb.jpg";
import Gok from "../../assets/gok.png";
import County from "../../assets/County.png";

const logos = [
  { logo: County, name: "County Government of Vihiga" },
  { logo: Gok, name: "Government of Kenya (GOK)" },
  { logo: Helb, name: "Higher Education Loans Board (HELB)" },
  { logo: Knec, name: "Kenya National Examinations Council (KNEC)" },
  { logo: Knqa, name: "Kenya National Qualifications Authority (KNQA)" },
  { logo: Kuccps, name: "Kenya Universities and Colleges Central Placement Service (KUCCPS)" },
  { logo: Moe, name: "Ministry of Education (MOE)" },
  { logo: Nita, name: "National Industrial Training Authority (NITA)" },
  { logo: Cdacc, name: "Curriculum Development, Assessment and Certification Council (CDACC)" },
  { logo: Vibrant, name: "Vibrant Village Foundation" },
  { logo: Tveta, name: "Technical and Vocational Education and Training Authority (TVETA)" },
];

export default function Partners() {
  return (
    <section className="partners-section">

      {/* Header */}
      <div className="partners-header">
        <span className="partners-eyebrow">Trusted By</span>
        <h2 className="partners-title">Our Partners & Accreditors</h2>
        <p className="partners-subtitle">
          Proudly recognised and supported by leading government bodies,
          institutions, and organisations across Kenya.
        </p>
      </div>

      {/* Marquee — faded edges via CSS mask */}
      <div className="partners-marquee-wrap">
        <div className="marquee">
          <div className="marquee-track">
            {[...logos, ...logos].map((item, index) => (
              <div className="partner-card" key={index}>
                <div className="partner-card__img-wrap">
                  <img src={item.logo} alt={item.name} />
                </div>
                <p className="partner-card__name">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="partners-stats">
        <div className="partners-stat">
          <span className="partners-stat__num">11+</span>
          <span className="partners-stat__label">Partners</span>
        </div>
        <div className="partners-stat__divider" />
        <div className="partners-stat">
          <span className="partners-stat__num">6+</span>
          <span className="partners-stat__label">Gov't Bodies</span>
        </div>
        <div className="partners-stat__divider" />
        <div className="partners-stat">
          <span className="partners-stat__num">Since 2020</span>
          <span className="partners-stat__label">Accredited</span>
        </div>
      </div>

    </section>
  );
}