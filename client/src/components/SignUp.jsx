import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // Default to regular user
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role
      });

      setSuccess(response.data.message);
      
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('user');

      // Auto redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card fade-in">
        <h2>Create Account</h2>
        <p className="subtitle">Sign up to get started with Hostify</p>

        {error && <p className="errmsg">{error}</p>}
        {success && <p className="successmsg">{success} Redirecting to login...</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name"><FaUser /> Full Name</label>
            <input 
              type="text" 
              id="name"
              placeholder="e.g. John Doe"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
            />
          </div>

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
            <label htmlFor="role"><FaUserTag /> Account Type</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-btn ${role === 'user' ? 'active' : ''}`}
                onClick={() => setRole('user')}
              >
                Guest (Find Stays)
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'owner' ? 'active' : ''}`}
                onClick={() => setRole('owner')}
              >
                Host (List Stays)
              </button>
            </div>
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

          <div className="form-group">
            <label htmlFor="confirmPassword"><FaLock /> Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
