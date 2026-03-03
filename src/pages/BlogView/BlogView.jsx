import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import "./BlogView.css";

import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const BlogView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { blog, allBlogs } = location.state || {};

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="blogview-empty">
          <h2>No blog selected</h2>
          <button onClick={() => navigate("/blog")}>Back to Blog</button>
        </div>
        <Footer />
      </>
    );
  }

  const relatedBlogs = allBlogs.filter((b) => b.title !== blog.title);

  return (
    <>
      <Navbar />
      <section className="blogview-container">
        {/* Main Blog */}
        <div className="blogview-main">
          <div className="blogview-img-container">
            <img src={blog.image} alt={blog.title} />
          </div>

          <div className="blogview-meta">
            <span>
              <FaCalendarAlt /> {new Date(blog.date).toDateString()}
            </span>
            <span>
              <FaMapMarkerAlt /> {blog.location}
            </span>
          </div>

          <h1>{blog.title}</h1>
          <p className="blogview-content">{blog.content.repeat(4)}</p>
        </div>

        {/* Related Blogs */}
        <aside className="blogview-related">
          <h3>Related News</h3>
          {relatedBlogs.slice(0, 4).map((item, index) => (
            <div
              key={index}
              className="related-card"
              onClick={() =>
                navigate("/blogview", { state: { blog: item, allBlogs } })
              }
            >
              <div className="related-img-container">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="related-info">
                <h4>{item.title}</h4>
                <span>{new Date(item.date).toDateString()}</span>
              </div>
            </div>
          ))}
        </aside>
      </section>
      <Footer />
    </>
  );
};

export default BlogView;