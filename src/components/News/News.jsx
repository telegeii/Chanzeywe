import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../pages/Blog/Blog.css";
import { FaArrowRight, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { apiGet } from "../../utils/api";

// Fallback cover for posts published without a cover image.
import Chanzeywe from "../../assets/Chanzeywe.jpg";

const News = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    apiGet("/blog.php")
      .then((posts) =>
        setBlogs(
          posts.slice(0, 3).map((p) => ({
            image: p.image || Chanzeywe,
            title: p.title,
            content: p.excerpt || p.body || "",
            date: p.date,
            location: p.location,
          }))
        )
      )
      .catch(() => setBlogs([]));
  }, []);

  if (blogs.length === 0) return null;

  return (
    <section className="blog-section">
      <div className="blog-header">
        <span className="blog-eyebrow">Newsroom</span>
        <h2>Latest News & Updates</h2>
        <p>
          Announcements, partnerships, and achievements from Chanzeywe
          Vocational College.
        </p>
      </div>

      <div className="blog-grid">
        {blogs.map((blog, index) => (
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
              <p>
                {blog.content.length > 120
                  ? `${blog.content.slice(0, 120)}...`
                  : blog.content}
              </p>

              <button
                className="read-more"
                onClick={() =>
                  navigate("/blogview", { state: { blog, allBlogs: blogs } })
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
