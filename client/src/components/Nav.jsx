import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaInfoCircle, FaEnvelope, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaBars, FaTimes, FaTachometerAlt } from 'react-icons/fa';

function Nav() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="glass-nav">
      <div className="nav-logo">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <span className="logo-text">HOSTIFY</span>
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="pages nav-desktop">
        <Link to="/" className="nav-link"><FaHome /> <span>Home</span></Link>
        <Link to="/about" className="nav-link"><FaInfoCircle /> <span>About</span></Link>
        <Link to="/contact" className="nav-link"><FaEnvelope /> <span>Contact</span></Link>
        {user && (
          <Link to="/main" className="nav-link dashboard-link">
            <FaTachometerAlt /> <span>Dashboard</span>
          </Link>
        )}
      </div>

      <div className="buttons nav-desktop">
        {user ? (
          <div className="user-profile">
            <span className="welcome-msg">
              Hi, <strong>{user.name || 'User'}</strong>
              <span className={`role-badge ${user.role}`}>
                {user.role === 'owner' ? 'Host' : 'Guest'}
              </span>
            </span>
            <button onClick={handleLogout} className="btn-logout">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login"><button className="btn-login"><FaSignInAlt /> Login</button></Link>
            <Link to="/signup"><button className="btn-signup"><FaUserPlus /> Sign Up</button></Link>
          </>
        )}
      </div>

      {/* Hamburger Button (mobile only) */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu Overlay */}
      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Mobile Drawer */}
      <div className={`nav-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="nav-drawer-header">
          <span className="logo-text">HOSTIFY</span>
          <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>
            <FaTimes />
          </button>
        </div>

        {user && (
          <div className="nav-drawer-user">
            <span className="welcome-msg">
              Hi, <strong>{user.name || 'User'}</strong>
            </span>
            <span className={`role-badge ${user.role}`}>
              {user.role === 'owner' ? 'Host' : 'Guest'}
            </span>
          </div>
        )}

        <div className="nav-drawer-links">
          <Link to="/" className="nav-link"><FaHome /> <span>Home</span></Link>
          <Link to="/about" className="nav-link"><FaInfoCircle /> <span>About</span></Link>
          <Link to="/contact" className="nav-link"><FaEnvelope /> <span>Contact</span></Link>
          {user && (
            <Link to="/main" className="nav-link dashboard-link">
              <FaTachometerAlt /> <span>Dashboard</span>
            </Link>
          )}
        </div>

        <div className="nav-drawer-actions">
          {user ? (
            <button onClick={handleLogout} className="btn-logout nav-drawer-btn">
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="nav-drawer-btn-link">
                <button className="btn-login nav-drawer-btn"><FaSignInAlt /> Login</button>
              </Link>
              <Link to="/signup" className="nav-drawer-btn-link">
                <button className="btn-signup nav-drawer-btn"><FaUserPlus /> Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
