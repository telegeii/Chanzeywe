import React from "react";
import Level4 from "../../assets/Level4.png";
import Level5 from "../../assets/Level5.png";
import Level6 from "../../assets/Level6.png";
import "./Curricula.css";

const curriculaData = [
  {
    id: 1,
    title: "Artisan Level 4",
    level: "Level 4",
    description:
      "Provides learners with foundational, hands-on skills required to perform specific technical tasks in a trade or occupation.",
    image: Level4,
  },
  {
    id: 2,
    title: "Certificate Level 5",
    level: "Level 5",
    description:
      "Prepares learners for advanced technical and supervisory roles by strengthening problem-solving and applied practical skills.",
    image: Level5,
  },
  {
    id: 3,
    title: "Diploma Level 6",
    level: "Level 6",
    description:
      "Equips learners with in-depth technical knowledge and leadership abilities to manage complex systems or projects.",
    image: Level6,
  },
];

const Curricula = () => {
  return (
    <section className="curricula">
      <div className="curricula__container">

        {/* Header */}
        <header className="curricula__header">
          <h2>Modularized CBET Curricula</h2>
          <p>
            A <strong>Competency-Based Education and Training (CBET)</strong>{" "}
            curriculum is modular, learner-centered, and focused on
            industry-ready competencies.
          </p>
        </header>

        {/* Cards */}
        <div className="curricula__grid">
          {curriculaData.map((item) => (
            <article className="curricula__card" key={item.id}>

              {/* Icon circle */}
              <div className="curricula__img-wrap">
                <img src={item.image} alt={item.title} />
              </div>

              {/* Level badge */}
              <span className="curricula__level">{item.level}</span>

              {/* Title */}
              <h3>{item.title}</h3>

              {/* Gold divider */}
              <div className="curricula__divider" />

              {/* Description */}
              <p>{item.description}</p>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Curricula;