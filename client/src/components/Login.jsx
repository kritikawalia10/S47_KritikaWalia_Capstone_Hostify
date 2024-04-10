import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {GoogleLogin} from 'react-google-login';

function Login() {

  const clientId = "70314281965-8io920bulao023rl36gpcdb2bk2lb20d.apps.googleusercontent.com"

  const inputRef = useRef();
  const errRef = useRef();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [name, email, password]);

  const handleSubmit = (e) => {
    e.preventDefault(); 
    // console.log("Name:", name);
    // console.log("Email:", email);
    // console.log("Password:", password);
    
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='login'>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <h3>Login to your account</h3>
          <div>
            <label htmlFor="name">Username</label>
            <input type="text" id="name" value={name} ref={inputRef} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email}  onChange={(e) => setEmail(e.target.value)} />
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
