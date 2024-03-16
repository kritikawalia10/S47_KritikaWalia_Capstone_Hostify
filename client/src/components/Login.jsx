import React from 'react'
import { Link } from 'react-router-dom'

function Login() {
  return (
    <>
    <form>
    <div className='login'>
        <h2>Login to your account</h2>
      <div>
      <label htmlFor="name"> Username</label>
      <input type="text" />
      </div>

      <div>
      <label htmlFor="email">Email</label>
      <input type="email"/>
      </div>
      
      <div>
      <label htmlFor="password">Password</label>
      <input type="password" />
      </div>

      <div>
      <button>Login</button>
      </div>

      <div>
        <h4>Don't have an account? <Link to='/signup' style={{ textDecoration: 'none', color: 'blue' }}>Sign Up</Link></h4>
      </div>
      
    </div>
    </form>
    </>
  )
}

export default Login
