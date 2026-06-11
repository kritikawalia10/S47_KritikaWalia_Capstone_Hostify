import React from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaShareAlt, FaPhoneAlt } from 'react-icons/fa';

function Contact() {
  return (
    <div className="info-page-container fade-in">
      <div className="info-card contact-grid">
        <div className="contact-info-section">
          <h1>Contact Us</h1>
          <p>
            Thank you for choosing Hostify! We value your feedback and are here to assist you in any way we can. Please reach out to us if you have questions, partnership queries, or security concerns.
          </p>

          <div className="contact-detail-list">
            <div className="contact-detail-item">
              <FaEnvelope className="c-icon" />
              <div>
                <h4>Support Email</h4>
                <p><a href="mailto:support@hostifyapp.com">support@hostifyapp.com</a></p>
              </div>
            </div>
            
            <div className="contact-detail-item">
              <FaPhoneAlt className="c-icon" />
              <div>
                <h4>Call Support</h4>
                <p>+91 98765 43210 (Mon-Sat, 9AM - 6PM)</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <FaMapMarkerAlt className="c-icon" />
              <div>
                <h4>Headquarters</h4>
                <p>
                  Hostify Headquarters<br />
                  123 Main Street, Sector 21<br />
                  Gurugram, Haryana, 122001, India
                </p>
              </div>
            </div>

            <div className="contact-detail-item">
              <FaShareAlt className="c-icon" />
              <div>
                <h4>Social Network</h4>
                <p className="social-links">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a> | {' '}
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a> | {' '}
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
