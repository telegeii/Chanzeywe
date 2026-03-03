import React from "react";
import Kiswahili from "../../assets/Kiswa.pdf";
import English from "../../assets/English.pdf";
import Audio from "../../assets/AudioCharter.mp3";
import Video from "../../assets/VideoCharter.mp4";
import "./Charter.css";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar";

const Charter = () => {
  return (
    <div className="charter-wrapper">
      <Navbar />

      <section className="charter-page">
        {/* Header */}
        <header className="charter-header">
          <h2>Services Provided by Chanzeywe Vocational Training College</h2>
          <p>Skills to Transform Livelihoods</p>
        </header>

        {/* PDF SECTION */}
        <div className="charter-documents">
          {/* English LEFT */}
          <div className="charter-card">
            <h3>English Version</h3>

            <div className="pdf-wrapper">
              <iframe
                src={`${English}#toolbar=0&navpanes=0&scrollbar=0`}
                title="English Charter"
              />
            </div>

            <a href={English} download className="download-btn">
              Download English PDF
            </a>
          </div>

          {/* Kiswahili RIGHT */}
          <div className="charter-card">
            <h3>Kiswahili Version</h3>

            <div className="pdf-wrapper">
              <iframe
                src={`${Kiswahili}#toolbar=0&navpanes=0&scrollbar=0`}
                title="Kiswahili Charter"
              />
            </div>

            <a href={Kiswahili} download className="download-btn">
              Pakua PDF ya Kiswahili
            </a>
          </div>
        </div>

        {/* MEDIA SECTION */}
        <div className="charter-media">
          {/* Video */}
          <div className="media-card">
            <h3>Sign Language Version (Video)</h3>
            <video controls>
              <source src={Video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Audio */}
          <div className="media-card audio">
            <h3>Audio Version</h3>
            <audio controls>
              <source src={Audio} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Charter;