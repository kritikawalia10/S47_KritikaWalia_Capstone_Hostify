import React from 'react'
import Home from './components/Home'
import './App.css'
import {Routes, Route} from 'react-router-dom'
import About from './components/About'
import Nav from './components/Nav'
import Contact from './components/Contact'
function App() {

  return (
    <> 
      <Nav/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path = '/about' element={<About/>}/>
        <Route path = '/contact' element={<Contact/>}/>
      </Routes>
      
    </>
  )
}

export default App
