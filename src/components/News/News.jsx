import React from "react";
import { useNavigate } from "react-router-dom";
import "../../pages/Blog/Blog.css";
import { FaArrowRight, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

// Dummy blogs data (replace with your actual blog images/content)
import Moe from "../../assets/MoE.png";
import Chanzeywe from "../../assets/Chanzeywe.jpg";
import Safaricom from "../../assets/Safaricom.jpg";

const News = () => {
  const navigate = useNavigate();

  const blogs = [
    {
      image: Moe,
      title: "Ministry of Education Certification",
      content:
        "Chanzeywe Vocational College is officially certified by the Ministry of Education under the State Department for Vocational and Technical Training.",
      date: "2026-02-28",
      location: "Chanzeywe",
    },
    {
      image: Chanzeywe,
      title: "About Chanzeywe Vocational College",
      content:
        "Founded in 2020 and located in Vihiga County near Mahanga Market, the college offers quality, practical and industry-focused training.",
      date: "2026-02-20",
      location: "Chanzeywe",
    },
    {
      image: Safaricom,
      title: "Safaricom Foundation ICT Support",
      content:
        "Safaricom Foundation donated computers to enhance digital literacy and hands-on ICT training at the college.",
      date: "2026-02-10",
      location: "Chanzeywe",
    },
  ];

  // Sort latest first
  const sortedBlogs = [...blogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Only show 3 blogs in preview
  const visibleBlogs = sortedBlogs.slice(0, 3);

  return (
    <section className="blog-section">
      <div className="blog-header">
        <h2>Latest News & Updates</h2>
      </div>

      <div className="blog-grid">
        {visibleBlogs.map((blog, index) => (
          <div className="blog-card" key={index}>
            <div className="blog-img">
              <img src={blog.image} alt={blog.title} />
            </div>

            <div className="blog-body">
              <div className="blog-meta">
                <span>
                  <FaCalendarAlt /> {new Date(blog.date).toDateString()}
                </span>
                <span>
                  <FaMapMarkerAlt /> {blog.location}
                </span>
              </div>

              <h3>{blog.title}</h3>
              <p>{blog.content.slice(0, 120)}...</p>

              <button
                className="read-more"
                onClick={() =>
                  navigate("/blogview", { state: { blog, allBlogs: sortedBlogs } })
                }
              >
                Read More <FaArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default News;