import React from 'react'
import { Link } from 'react-router-dom'

function Nav() {
  return (
    <div>
      <nav>
        <div className="pages">
        <Link to='/' style={{ textDecoration: 'none', color: 'white', margin:'10px' }}><h2 className='active'>Home</h2></Link>
        <Link to='/about' style={{ textDecoration: 'none', color: 'white', margin:'10px' }}><h2 className='active'>About</h2></Link>
        <Link to='/contact' style={{ textDecoration: 'none', color: 'white', margin:'10px' }}><h2 className='active'>Contact</h2></Link>
        </div>
        <div className="buttons">
        <button>Login</button>
        <button>Sign Up</button>
        </div>

      </nav>
    </div>
  )
}

export default Nav
