import React from 'react';
import { FaInfoCircle, FaUsers, FaLightbulb, FaShieldAlt } from 'react-icons/fa';

function About() {
  return (
    <div className="info-page-container fade-in">
      <div className="info-card">
        <h1><FaInfoCircle /> About Hostify</h1>
        <p className="lead-paragraph">
          Hostify is an all-in-one platform built to solve the universal housing challenges faced by students, remote workers, and travelers living away from home.
        </p>
        <p>
          We bridge the gap between accommodation seekers and local property hosts. Seeking temporary housing can be stressful—that is why we provide real-time room availability, simple pricing models, verified listings, and a responsive experience.
        </p>

        <div className="about-values">
          <div className="value-item">
            <FaUsers className="val-icon" />
            <h4>Our Mission</h4>
            <p>To make finding PGs and hostels as simple and transparent as booking a hotel room.</p>
          </div>
          <div className="value-item">
            <FaLightbulb className="val-icon" />
            <h4>Smart Guidance</h4>
            <p>Our integrated AI recommends properties that align with your unique budget and room preferences.</p>
          </div>
          <div className="value-item">
            <FaShieldAlt className="val-icon" />
            <h4>Trust & Verification</h4>
            <p>Host verification and direct owner booking control guarantee a scam-free, secure platform.</p>
          </div>
        </div>

        <div className="about-footer-sig">
          <h4>Made with ❤️ by Kritika Walia</h4>
          <h5>© 2026 Hostify. All rights reserved.</h5>
        </div>
      </div>
    </div>
  );
}

export default About;
