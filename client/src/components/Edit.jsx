import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaBuilding, FaBed, FaDollarSign, FaImage, FaArrowLeft, FaSave } from 'react-icons/fa';

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [hostelData, setHostelData] = useState({
    hostelName: '',
    roomsAvail: '',
    roomType: '',
    price: '',
    imgUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  // Redirect if logged out or not owner
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'owner') {
        navigate('/main');
      }
    }
  }, [user, authLoading, navigate]);

  // Fetch current hostel data
  useEffect(() => {
    const fetchHostel = async () => {
      if (!user || !id) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/hostels/${id}`);
        const data = response.data;
        setHostelData({
          hostelName: data.hostelName || '',
          roomsAvail: data.roomsAvail || '',
          roomType: data.roomType || '',
          price: data.price || '',
          imgUrl: data.imgUrl || ''
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch property details.');
      } finally {
        setFetching(false);
      }
    };
    fetchHostel();
  }, [id, user]);

  const handleInput = (e) => {
    setHostelData({ ...hostelData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = {
      hostelName: hostelData.hostelName,
      roomsAvail: parseInt(hostelData.roomsAvail),
      price: parseInt(hostelData.price),
      roomType: hostelData.roomType,
      imgUrl: hostelData.imgUrl.trim()
    };

    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/hostels/${id}`, data, { headers });

      if (response.status === 200) {
        navigate('/main');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update property. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="loading-state"><p>Fetching property details...</p></div>;
  }

  return (
    <div className="form-page">
      <div className="form-card fade-in">
        <div className="form-card-header">
          <button className="btn-back" onClick={() => navigate('/main')}>
            <FaArrowLeft /> Cancel
          </button>
          <h2>Edit Property Listing</h2>
          <p>Modify the details of your hostel or PG accommodation</p>
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
              min="0"
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
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imgUrl"><FaImage /> Cover Photo URL</label>
            <input
              type="url"
              name="imgUrl"
              id="imgUrl"
              value={hostelData.imgUrl}
              onChange={handleInput}
              required
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Saving Changes...' : <><FaSave /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Edit;
