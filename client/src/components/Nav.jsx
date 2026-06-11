import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaInfoCircle, FaEnvelope, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';

function Nav() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-nav">
      <div className="nav-logo">
        <Link to="/">
          <span className="logo-text">HOSTIFY</span>
        </Link>
      </div>
      <div className="pages">
        <Link to="/" className="nav-link">
          <FaHome /> <span>Home</span>
        </Link>
        <Link to="/about" className="nav-link">
          <FaInfoCircle /> <span>About</span>
        </Link>
        <Link to="/contact" className="nav-link">
          <FaEnvelope /> <span>Contact</span>
        </Link>
        {user && (
          <Link to="/main" className="nav-link dashboard-link">
            <span>Dashboard</span>
          </Link>
        )}
      </div>
      <div className="buttons">
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
            <Link to="/login">
              <button className="btn-login">
                <FaSignInAlt /> Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="btn-signup">
                <FaUserPlus /> Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;
