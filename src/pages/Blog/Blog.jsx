import React, { useState } from "react";
import "./Blog.css";
import { useNavigate } from "react-router-dom";
import Moe from "../../assets/Moe.png";
import Chanzeywe from "../../assets/Chanzeywe.jpg";
import Safaricom from "../../assets/Safaricom.jpg";
import Vibrant from "../../assets/Vibrant.jpeg";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";

import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Blog = () => {
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
    {
      image: Vibrant,
      title: "Vibrant Youth Skills Empowerment",
      content:
        "Through partnerships, the college empowers youth with employable skills and entrepreneurship training.",
      date: "2026-01-30",
      location: "Chanzeywe",
    },
    {
      image: Moe,
      title: "Competency Based Training (CBT)",
      content:
        "Competency Based Training ensures learners gain real-world skills aligned with industry standards.",
      date: "2026-01-15",
      location: "Chanzeywe",
    },
  ];

  const sortedBlogs = [...blogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const blogsPerPage = 3;
  const [page, setPage] = useState(0);

  const startIndex = page * blogsPerPage;
  const visibleBlogs = sortedBlogs.slice(
    startIndex,
    startIndex + blogsPerPage
  );

  return (
    <>
      <Navbar />

      <section className="blog-section">
        <div className="blog-header">
          <h2>Latest News & Updates</h2>
          <p>
            Discover announcements, partnerships, and achievements from
            Chanzeywe Vocational College.
          </p>
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
                    navigate("/blogview", {
                      state: { blog, allBlogs: sortedBlogs },
                    })
                  }
                >
                  Read More <FaArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="blog-pagination">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
          >
            <FaChevronLeft /> Previous
          </button>

          <button
            onClick={() => setPage(page + 1)}
            disabled={startIndex + blogsPerPage >= sortedBlogs.length}
          >
            Next <FaChevronRight />
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Blog;