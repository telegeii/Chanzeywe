import React from "react";
import "./Contact.css";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar";

const Contact = () => {
  return (
    <div className="contact-page-wrapper">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="contact-page">
        <div className="contact-container">
          {/* FORM SECTION */}
          <div className="contact-form-section">
            <h2>Contact Us</h2>
            <p>Keep in touch with us</p>
            <form>
              <input type="text" placeholder="Your Name" />
              <input type="email" placeholder="Email" />
              <input type="text" placeholder="Subject" />
              <input type="number" placeholder="Phone" />
              <textarea placeholder="Message"></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>

          {/* ADDRESS + MAP SECTION */}
          <div className="contact-info-section">
            <h2>Address</h2>
            <p>
              Chanzeywe TVC is a public TVET institution offering Technical and
              Business Courses at Diploma, Certificate, and Artisan levels. We
              are situated in Vihiga Constituency, Vihiga County, 1 km from
              Mahanga Market.
            </p>
            <p>
              <i className="fas fa-map-marker-alt"></i> P.O. Box 413 – 50310 Vihiga
            </p>
            <p>
              <i className="fas fa-phone-alt"></i> +254 740 932 743
            </p>
            <p>
              <i className="fas fa-envelope"></i> chnazeywetvc@gmail.com
            </p>

            {/* Google Map Embed */}
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.837082956482!2d34.6658738152952!3d0.024515430024676094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x178007e3a81275f7%3A0x1ad962e8c43f4cc2!2sChanzeywe%20Technical%20and%20Professional%20College!5e0!3m2!1sen!2ske!4v1709090000000!5m2!1sen!2ske"
                title="Chanzeywe TVC Location"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;