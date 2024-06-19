import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Add.css';
import axios from 'axios';

function Add() {
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [hostelData, setHostelData] = useState({
    name: '',
    roomsAvailable: '',
    price: '',
    roomType: ''
  });

  const handleInput = (e) => {
    e.persist();
    setHostelData({ ...hostelData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name: hostelData.name,
      roomsAvailable: hostelData.roomsAvailable,
      price: hostelData.price,
      roomType: hostelData.roomType
    };

    try {
      const response = await axios.post(`http://localhost:8080/addData/${id}`, data);

      if (response.status !== 200) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='add'>
      <h2>Add a New Hostel</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={hostelData.name}
          onChange={handleInput}
          placeholder='Hostel Name...'
          required
        />
        <br />
        <input
          type="text"
          name="roomsAvailable"
          value={hostelData.roomsAvailable}
          onChange={handleInput}
          placeholder='Rooms Available...'
          required
        />
        <br />
        <input
          type="text"
          name="roomType"
          value={hostelData.roomType}
          onChange={handleInput}
          placeholder='Room Type...'
          required
        />
        <br />
        <input
          type="text"
          name="price"
          value={hostelData.price}
          onChange={handleInput}
          placeholder='Price...'
          required
        />
        <br />
        <br />
        <button type="submit" style={{ backgroundColor: 'green', color: 'white' }} disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
}

export default Add;
