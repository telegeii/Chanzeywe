import React from "react";
import Level4 from "../../assets/Level4.png";
import Level5 from "../../assets/Level5.png";
import Level6 from "../../assets/Level6.png";
import "./Curricula.css";

const curriculaData = [
  {
    id: 1,
    title: "Level 4",
    description:
      "Provides learners with foundational, hands-on skills required to perform specific technical tasks in a trade or occupation.",
    image: Level4,
  },
  {
    id: 2,
    title: "Level 5",
    description:
      "Prepares learners for advanced technical and supervisory roles by strengthening problem-solving and applied practical skills.",
    image: Level5,
  },
  {
    id: 3,
    title: "Level 6",
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
            curriculum is modular, learner-centered, and focused on industry-ready
            competencies.
          </p>
        </header>

        {/* Cards */}
        <div className="curricula__grid">
          {curriculaData.map((item) => (
            <article className="curricula__card" key={item.id}>
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Curricula;