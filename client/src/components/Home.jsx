import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaArrowRight, FaSearch, FaShieldAlt, FaLanguage, FaHeadphones } from 'react-icons/fa';

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h2 className="sub-headline">Discover your perfect stay with</h2>
          <h1 className="headline">HOSTIFY</h1>
          <p className="hero-description">
            Hostify is the ultimate accommodation platform matching students, travelers, and working professionals with the best available hostels and PG accommodations. Fast, secure, and smart.
          </p>
          <div className="cta-wrapper">
            <Link to={user ? "/main" : "/login"}>
              <button className="btn-primary-cta">
                Get Started <FaArrowRight style={{ marginLeft: '8px' }} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon"><FaSearch /></div>
          <h3>Smart Search</h3>
          <p>Instantly find rooms based on price, location constraints, and amenities.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><FaShieldAlt /></div>
          <h3>Secure Bookings</h3>
          <p>Rest assured with our verified listings and secure booking management flow.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><FaLanguage /></div>
          <h3>Multilingual Support</h3>
          <p>Access and list accommodations effortlessly in multiple languages.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><FaHeadphones /></div>
          <h3>24/7 Live Support</h3>
          <p>Dedicated customer support to assist you with check-ins or property listing.</p>
        </div>
      </div>

      <div className="footer">
        <p>© 2026 Hostify. Made with ❤️ for capstone success.</p>
      </div>
    </div>
  );
}

export default Home;
