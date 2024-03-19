import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='login'>
          <h3>Login to your account</h3>
          <div>
            <label htmlFor="name">Username</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div>
            <button type="submit">Login</button>
          </div>

          <div>
            <h4>Don't have an account? <Link to='/signup' style={{ textDecoration: 'none', color: 'blue' }}>Sign Up</Link></h4>
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;
