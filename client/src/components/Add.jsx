import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaBuilding, FaBed, FaDollarSign, FaImage, FaArrowLeft, FaSave } from 'react-icons/fa';

function Add() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [hostelData, setHostelData] = useState({
    hostelName: '',
    roomsAvail: '',
    roomType: '',
    price: '',
    imgUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not host or logged out
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'owner') {
        navigate('/main');
      }
    }
  }, [user, authLoading, navigate]);

  const handleInput = (e) => {
    setHostelData({ ...hostelData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Form payload
    const data = {
      hostelName: hostelData.hostelName,
      roomsAvail: parseInt(hostelData.roomsAvail),
      price: parseInt(hostelData.price),
      roomType: hostelData.roomType,
      imgUrl: hostelData.imgUrl.trim() || undefined
    };

    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/hostels`, data, { headers });

      if (response.status === 201) {
        navigate('/main');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add hostel. Please verify input data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card fade-in">
        <div className="form-card-header">
          <button className="btn-back" onClick={() => navigate('/main')}>
            <FaArrowLeft /> Back
          </button>
          <h2>List a New Property</h2>
          <p>Provide the details of your hostel or PG accommodation</p>
        </div>

        {error && <p className="errmsg">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="hostelName"><FaBuilding /> Hostel/PG Name</label>
            <input
              type="text"
              name="hostelName"
              id="hostelName"
              value={hostelData.hostelName}
              onChange={handleInput}
              placeholder="e.g. Green Heights Girls PG"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="roomsAvail"><FaBed /> Rooms Available</label>
            <input
              type="number"
              name="roomsAvail"
              id="roomsAvail"
              value={hostelData.roomsAvail}
              onChange={handleInput}
              placeholder="e.g. 5"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="roomType"><FaBed /> Room Type Description</label>
            <input
              type="text"
              name="roomType"
              id="roomType"
              value={hostelData.roomType}
              onChange={handleInput}
              placeholder="e.g. Single AC, Double Non-AC"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price"><FaDollarSign /> Price (INR/Month)</label>
            <input
              type="number"
              name="price"
              id="price"
              value={hostelData.price}
              onChange={handleInput}
              placeholder="e.g. 12000"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imgUrl"><FaImage /> Cover Photo URL (Optional)</label>
            <input
              type="url"
              name="imgUrl"
              id="imgUrl"
              value={hostelData.imgUrl}
              onChange={handleInput}
              placeholder="Paste an image URL link..."
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Adding Listing...' : <><FaSave /> Publish Listing</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Add;
