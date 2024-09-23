import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';


function Login() {
  
  const inputRef = useRef();
  const errRef = useRef();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [name, email, password]);

  const handleSubmit = (e) => {
    e.preventDefault(); 

    setName('');
    setEmail('');
    setPassword('');
  };


  // Callback for Google Login Success
  const handleGoogleSuccess = (response) => {
    const decoded = jwtDecode(response.credential); // Decode JWT token
    setUserInfo(decoded); // Set user info
    setSuccess(true);
  };

  // Callback for Google Login Failure

  const handleGoogleFailure = () => {
    setErrMsg('Google Sign-In was unsuccessful. Try again.');
  };

  return (

    <>
      <form onSubmit={handleSubmit}>
        <div className='login'>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <h3>Login to your account</h3>

          {success ? (
            <div>
              <h4>Welcome, {userInfo?.name}!</h4>
              <p>Email: {userInfo?.email}</p>
              <button onClick={() => {
                googleLogout();
                setUserInfo(null);
                setSuccess(false);
              }}>Logout</button>
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="name">Username</label>
                <input 
                  type="text" 
                  id="name" 
                  value={name} 
                  ref={inputRef} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}  
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>

              <div>
                <button type="submit">Login</button>
              </div>

              <div>
                <h4>Don't have an account? <Link to='/signup' style={{ textDecoration: 'none', color: 'blue' }}>Sign Up</Link></h4>
              </div>

              <div style={{ marginTop: '20px' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                />
              </div>
            </>
          )}
        </div>
      </form>
    </>

  );
}

export default Login;
