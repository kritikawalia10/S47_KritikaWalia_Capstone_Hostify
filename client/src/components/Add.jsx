import React, { useState } from 'react';
import './Add.css';

function Add() {
  const [hostelData, setHostelData] = useState({
    name: '',
    roomsAvailable: '',
    price: '',
    roomType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHostelData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, roomsAvailable, price, roomType } = hostelData;
    const data = { name, roomsAvailable, price, roomType };

    try {
      const response = await fetch('http://localhost:8080/addData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add data');
      }

      setHostelData({
        name: '',
        roomsAvailable: '',
        price: '',
        roomType: ''
      });

      console.log('Data added successfully');
    } catch (error) {
      console.error('Error adding data:', error.message);
    }
  };

  return (
    <div className='add'>
      <h2>Add a New Hostel</h2>
      <form onSubmit={handleSubmit}>
        
          <input type="text" name="name" value={hostelData.name} onChange={handleChange} placeholder='Hostel Name...' required />
        <br />       
          <input type="text" name="roomsAvailable" value={hostelData.roomsAvailable} onChange={handleChange} placeholder='Rooms Available...' required />
        <br />
          <input type="text"  name="roomType" value={hostelData.roomType} onChange={handleChange} placeholder='Room Type...' required />
        <br />
          <input type="text" name="price" value={hostelData.price} onChange={handleChange} placeholder='Price...' required />
        <br />
        <br />
        <button type="submit" style={{backgroundColor: 'green', color: 'white'}}>Add</button>
      </form>
    </div>
  );
}

export default Add;
