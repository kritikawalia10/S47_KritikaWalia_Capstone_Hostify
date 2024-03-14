import React from 'react'

function Home() {
  return (
    <div className='home'>
      <nav>
        <div className="pages">
        <h2 className='active'>Home</h2>
        <h2 className='active'>About</h2>
        <h2 className='active'>Contact</h2>
        </div>
        <div className="buttons">
        <button>Login</button>
        <button>Sign Up</button>
        </div>

      </nav>

      <div className="info">
        <h2>Discover, select and get a temporary housing with</h2>
       <h1>HOSTIFY</h1>

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
