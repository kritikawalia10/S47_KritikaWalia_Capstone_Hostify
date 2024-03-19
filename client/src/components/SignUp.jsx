import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function SignUp() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
    <div className='login'>
      <h3>Create a new account</h3>
      <div>
      <label htmlFor="name"> Username</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
      </div>

      <div>
      <label htmlFor="email">Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      
      <div>
      <label htmlFor="password">Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      </div>

      <div>
      <label htmlFor="password">Confirm Password</label>
      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
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
  )
}

export default SignUp
