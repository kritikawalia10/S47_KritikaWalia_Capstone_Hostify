import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='home'>
      <div className="info">
        <h2>Discover your perfect stay with</h2>
       <h1>HOSTIFY</h1>

       <Link to='/main'><button className='btn'>Get Started 👉</button></Link>

       <p>Hostify is a platform where you can search for a better place to stay when you are away from your homes.
         It provides a user-friendly interface with an easy-to-use search engine. </p>
      </div>

      <div className="footer">
      <p>© 2024 Hostify. All rights reserved.</p>
      </div>
      
    </div>
  )
}

export default Home
