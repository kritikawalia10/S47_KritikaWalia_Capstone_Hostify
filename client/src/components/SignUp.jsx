import React from 'react'
import { Link } from 'react-router-dom'

function SignUp() {
  return (
    <>
    <form>
    <div className='login'>
      <h3>Create a new account</h3>
      <div>
      <label htmlFor="name"> Username</label>
      <input type="text"/>
      </div>

      <div>
      <label htmlFor="email">Email</label>
      <input type="email"/>
      </div>
      
      <div>
      <label htmlFor="password">Password</label>
      <input type="password"/>
      </div>

      <div>
      <label htmlFor="password">Confirm Password</label>
      <input type="password"/>
      </div>

      <div>
        <button>Sign Up</button>
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
