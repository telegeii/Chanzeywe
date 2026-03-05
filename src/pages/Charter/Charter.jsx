import React, { useState } from "react";
import Kiswahili from "../../assets/Kiswa.pdf";
import English from "../../assets/English.pdf";
import Audio from "../../assets/AudioCharter.mp3";
import Video from "../../assets/VideoCharter.mp4";
import "./Charter.css";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar";
import {
  FaDownload,
  FaFilePdf,
  FaVideo,
  FaVolumeUp,
  FaChevronRight,
  FaHandPaper,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Charter = () => {
  const [activeTab, setActiveTab] = useState("english");

  const pdfs = [
    {
      id: "english",
      lang: "English",
      label: "English Version",
      flag: "🇬🇧",
      src: English,
      downloadLabel: "Download English PDF",
    },
    {
      id: "kiswahili",
      lang: "Kiswahili",
      label: "Toleo la Kiswahili",
      flag: "🇰🇪",
      src: Kiswahili,
      downloadLabel: "Pakua PDF ya Kiswahili",
    },
  ];

  const active = pdfs.find((p) => p.id === activeTab);

  return (
    <div className="charter-wrapper">
      <Navbar />

      {/* ── Hero ── */}
      <div className="charter-hero">
        <div className="charter-hero__overlay" />
        <div className="charter-hero__content">
          <span className="charter-hero__eyebrow">Official Document</span>
          <h1>Service Charter</h1>
          <p>Skills to Transform Livelihoods</p>
          <div className="charter-hero__breadcrumb">
            <Link to="/">Home</Link>
            <FaChevronRight />
            <span>Service Charter</span>
          </div>
        </div>
      </div>

      <section className="charter-page">

        {/* ── Intro ── */}
        <div className="charter-intro">
          <span className="charter-eyebrow">Download & View</span>
          <h2>Chanzeywe TVC Service Charter</h2>
          <p>
            Our Service Charter outlines the services provided by Chanzeywe
            Vocational Training College, our commitments to learners, and the
            standards of service you should expect. Available in multiple formats
            for accessibility.
          </p>
        </div>

        {/* ── PDF Tabs ── */}
        <div className="charter-pdf-section">
          <div className="charter-tabs">
            {pdfs.map((p) => (
              <button
                key={p.id}
                className={`charter-tab${activeTab === p.id ? " charter-tab--active" : ""}`}
                onClick={() => setActiveTab(p.id)}
              >
                <FaFilePdf className="charter-tab__icon" />
                <span>{p.flag} {p.label}</span>
              </button>
            ))}
          </div>

          <div className="charter-pdf-viewer">
            <div className="charter-pdf-viewer__header">
              <div className="charter-pdf-viewer__meta">
                <FaFilePdf className="charter-pdf-viewer__pdf-icon" />
                <span>{active.flag} {active.label}</span>
              </div>
              <a href={active.src} download className="charter-download-btn">
                <FaDownload /> {active.downloadLabel}
              </a>
            </div>

            <div className="pdf-wrapper">
              <iframe
                key={activeTab}
                src={`${active.src}#toolbar=0&navpanes=0&scrollbar=0`}
                title={`${active.lang} Charter`}
              />
            </div>
          </div>
        </div>

        {/* ── Media section label ── */}
        <div className="charter-intro charter-intro--media">
          <span className="charter-eyebrow">Accessible Formats</span>
          <h2>Audio & Sign Language</h2>
          <p>
            We are committed to accessibility. View the charter in Sign Language
            or listen to the audio version below.
          </p>
        </div>

        {/* ── Media cards ── */}
        <div className="charter-media">

          {/* Video */}
          <div className="media-card">
            <div className="media-card__header">
              <div className="media-card__icon-wrap media-card__icon-wrap--video">
                <FaHandPaper />
              </div>
              <div>
                <span className="media-card__tag">Video</span>
                <h3>Sign Language Version</h3>
              </div>
            </div>
            <div className="media-card__player media-card__player--video">
              <video controls>
                <source src={Video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Audio */}
          <div className="media-card media-card--audio">
            <div className="media-card__header">
              <div className="media-card__icon-wrap media-card__icon-wrap--audio">
                <FaVolumeUp />
              </div>
              <div>
                <span className="media-card__tag media-card__tag--audio">Audio</span>
                <h3>Audio Version</h3>
              </div>
            </div>
            <p className="media-card__desc">
              Listen to the full Service Charter narrated in both English and
              Kiswahili for those who prefer audio access.
            </p>
            <div className="media-card__player">
              <audio controls>
                <source src={Audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Charter;