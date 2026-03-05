import React, { useState } from "react";
import "./Contact.css";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const contactDetails = [
  {
    icon: <FaMapMarkerAlt />,
    label: "Location",
    value: "P.O. Box 413 – 50310, Vihiga County",
    sub: "1 km from Mahanga Market",
  },
  {
    icon: <FaPhoneAlt />,
    label: "Phone",
    value: "+254 740 932 743",
    href: "tel:+254740932743",
  },
  {
    icon: <FaEnvelope />,
    label: "Email",
    value: "chanzeywetvc@gmail.com",
    href: "mailto:chanzeywetvc@gmail.com",
  },
  {
    icon: <FaClock />,
    label: "Working Hours",
    value: "Mon – Fri: 8:00 AM – 5:00 PM",
    sub: "Sat: 8:00 AM – 1:00 PM",
  },
];

const Contact = () => {
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="contact-page-wrapper">
      <Navbar />

      {/* ── Page Hero ── */}
      <div className="contact-hero">
        <div className="contact-hero__overlay" />
        <div className="contact-hero__content">
          <span className="contact-hero__eyebrow">We'd Love to Hear From You</span>
          <h1>Contact Us</h1>
          <div className="contact-hero__breadcrumb">
            <Link to="/">Home</Link>
            <FaChevronRight />
            <span>Contact</span>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <main className="contact-main">
        <div className="contact-container">

          {/* ── LEFT: Form ── */}
          <div className="contact-form-card">
            <div className="contact-form-card__header">
              <span className="contact-eyebrow">Send a Message</span>
              <h2>Get In Touch</h2>
              <p>Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-form__row">
                <div className={`contact-field${focused === "name" ? " contact-field--active" : ""}`}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. John Mwangi"
                    required
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
                <div className={`contact-field${focused === "email" ? " contact-field--active" : ""}`}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <div className="contact-form__row">
                <div className={`contact-field${focused === "phone" ? " contact-field--active" : ""}`}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
                <div className={`contact-field${focused === "subject" ? " contact-field--active" : ""}`}>
                  <label htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="How can we help?"
                    required
                    onFocus={() => setFocused("subject")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <div className={`contact-field${focused === "message" ? " contact-field--active" : ""}`}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Write your message here..."
                  required
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                />
              </div>

              <button type="submit" className={`contact-submit${submitted ? " contact-submit--sent" : ""}`}>
                {submitted ? (
                  <>✓ Message Sent!</>
                ) : (
                  <><FaPaperPlane className="contact-submit__icon" /> Send Message</>
                )}
              </button>
            </form>
          </div>

          {/* ── RIGHT: Info + Map ── */}
          <div className="contact-info-col">

            {/* Info card */}
            <div className="contact-info-card">
              <span className="contact-eyebrow">Find Us</span>
              <h2>Our Location</h2>
              <p className="contact-info-card__desc">
                Chanzeywe TVC is a public TVET institution offering Diploma,
                Certificate, and Artisan programmes, located in Vihiga County.
              </p>

              <div className="contact-details">
                {contactDetails.map((d, i) => (
                  <div key={i} className="contact-detail">
                    <div className="contact-detail__icon">{d.icon}</div>
                    <div className="contact-detail__body">
                      <span className="contact-detail__label">{d.label}</span>
                      {d.href ? (
                        <a href={d.href} className="contact-detail__value">{d.value}</a>
                      ) : (
                        <span className="contact-detail__value">{d.value}</span>
                      )}
                      {d.sub && <span className="contact-detail__sub">{d.sub}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.837082956482!2d34.6658738152952!3d0.024515430024676094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x178007e3a81275f7%3A0x1ad962e8c43f4cc2!2sChanzeywe%20Technical%20and%20Professional%20College!5e0!3m2!1sen!2ske!4v1709090000000!5m2!1sen!2ske"
                title="Chanzeywe TVC Location"
                allowFullScreen
                loading="lazy"
              />
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;