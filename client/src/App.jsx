import React from 'react';
import Home from './components/Home';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import About from './components/About';
import Nav from './components/Nav';
import Contact from './components/Contact';
import Login from './components/Login';
import SignUp from './components/SignUp';
import MainPage from './components/MainPage';
import Add from './components/Add';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="70314281965-8io920bulao023rl36gpcdb2bk2lb20d.apps.googleusercontent.com">
      <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/main' element={<MainPage />} />
        <Route path='/add' element={<Add />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
