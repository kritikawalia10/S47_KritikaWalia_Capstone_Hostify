import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg('');

    try {
      const response = await axios.post('${import.meta.env.VITE_API_URL}/api/auth/login', {
        email,
        password
      });

      login(response.data.token);
      navigate('/main');
    } catch (err) {
      console.error(err);
      setErrMsg(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (response) => {
    login(response.credential);
    navigate('/main');
  };

  const handleGoogleFailure = () => {
    setErrMsg('Google Sign-In was unsuccessful. Try again.');
  };

  return (
    <div className="login-page">
      <div className="login-card fade-in">
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to find your perfect stay</p>

        {errMsg && <p className="errmsg">{errMsg}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email"><FaEnvelope /> Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="e.g. john@example.com"
              value={email}  
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password"><FaLock /> Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : <><FaSignInAlt /> Login</>}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="google-btn-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="pill"
          />
        </div>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
