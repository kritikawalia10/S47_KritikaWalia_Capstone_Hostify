import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/register', {
        email,
        password
      });

      setSuccess(response.data.message);
      setError('');

      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response.data.message || 'An error occurred');
      setSuccess('');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='login'>
          <h3>Create a new account</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <div>
            <label htmlFor="name">Username</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          <div>
            <button type="submit">Sign Up</button>
          </div>

          <div>
            <h4>Already have an account? <Link to='/login' style={{ textDecoration: 'none', color: 'blue' }}>Login</Link></h4>
          </div>
        </div>
      </form>
    </>
  );
}

export default SignUp;
