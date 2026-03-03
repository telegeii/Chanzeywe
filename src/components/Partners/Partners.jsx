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
  { logo: Gok, name: "Government of Kenya" },
  { logo: Helb, name: "Higher Education Loan Board" },
  { logo: Knec, name: "Kenya National Examinations Council" },
  { logo: Knqa, name: "Kenya National Qualifications Authority" },
  { logo: Kuccps, name: "KUCCPS" },
  { logo: Moe, name: "Ministry of Education" },
  { logo: Nita, name: "NITA" },
  { logo: Cdacc, name: "CDACC" },
  { logo: Vibrant, name: "Vibrant Village Foundation" },
  { logo: Tveta, name: "TVETA" },
];

export default function Partners() {
  return (
    <section className="partners-section">
      <h2 className="partners-title">Our Partners</h2>

      <div className="marquee">
        <div className="marquee-track">
          {[...logos, ...logos].map((item, index) => (
            <div className="partner-card" key={index}>
              <img src={item.logo} alt={item.name} />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}