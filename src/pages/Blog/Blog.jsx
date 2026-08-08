import React, { useState, useEffect } from "react";
import "./Blog.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import { apiGet } from "../../utils/api";
import useSeo from "../../utils/useSeo";

import Chanzeywe from "../../assets/Chanzeywe.jpg";

import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Blog = () => {
  useSeo({
    title: "News & Blog",
    description: "Latest news, announcements and achievements from Chanzeywe Vocational Training College, Vihiga County, Kenya.",
  });

  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/blog.php")
      .then((posts) =>
        setBlogs(
          posts.map((p) => ({
            image: p.image || Chanzeywe,
            title: p.title,
            content: p.excerpt || p.body || "",
            date: p.date,
            location: p.location,
          }))
        )
      )
      .catch(() => setError("Unable to load news right now. Please try again shortly."))
      .finally(() => setLoading(false));
  }, []);

  const blogsPerPage = 3;
  const [page, setPage] = useState(0);

  const startIndex = page * blogsPerPage;
  const visibleBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);

  return (
    <>
      <Navbar />

      <section className="blog-section">
        <div className="blog-header">
          <span className="blog-eyebrow">Newsroom</span>
          <h2>Latest News & Updates</h2>
          <p>
            Discover announcements, partnerships, and achievements from
            Chanzeywe Vocational College.
          </p>
        </div>

        {loading && <p className="blog-status">Loading news…</p>}
        {!loading && error && <p className="blog-status blog-status--error">{error}</p>}
        {!loading && !error && blogs.length === 0 && (
          <p className="blog-status">No news posts have been published yet.</p>
        )}

        {!loading && !error && blogs.length > 0 && (
          <>
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
                    <p>
                      {blog.content.length > 120
                        ? `${blog.content.slice(0, 120)}...`
                        : blog.content}
                    </p>

                    <button
                      className="read-more"
                      onClick={() =>
                        navigate("/blogview", {
                          state: { blog, allBlogs: blogs },
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
                disabled={startIndex + blogsPerPage >= blogs.length}
              >
                Next <FaChevronRight />
              </button>
            </div>
          </>
        )}
      </section>

      <Footer />
    </>
  );
};

export default Blog;
