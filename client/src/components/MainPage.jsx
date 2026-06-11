import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FaSearch, FaPlus, FaTrash, FaEdit, FaBookmark, 
  FaRobot, FaPaperPlane, FaTimes, FaClipboardList, 
  FaCheck, FaTimesCircle, FaCheckCircle, FaStore 
} from 'react-icons/fa';

function MainPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Common State
  const [hostels, setHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  // Host Specific State
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' or 'bookings'
  const [bookings, setBookings] = useState([]);

  // User Specific State
  const [myBookings, setMyBookings] = useState([]);

  // AI Chat Widget State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: "Hello! I am your Hostify AI Assistant. Ask me anything about our available PGs/hostels! E.g. 'Recommend a room under 12000'." }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch Hostels & listings
  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      
      if (user.role === 'owner') {
        // Fetch only host's own listings
        const resHostels = await axios.get('${import.meta.env.VITE_API_URL}/api/hostels/my-listings', { headers });
        setHostels(resHostels.data);
        setFilteredHostels(resHostels.data);
        
        // Fetch host's received bookings
        const resBookings = await axios.get('${import.meta.env.VITE_API_URL}/api/bookings/owner-bookings', { headers });
        setBookings(resBookings.data);
      } else {
        // Fetch all hostels for regular users
        const resHostels = await axios.get('${import.meta.env.VITE_API_URL}/api/hostels');
        setHostels(resHostels.data);
        setFilteredHostels(resHostels.data);

        // Fetch user's own bookings
        const resMyBookings = await axios.get('${import.meta.env.VITE_API_URL}/api/bookings/my-bookings', { headers });
        setMyBookings(resMyBookings.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showBanner('Failed to fetch data.', false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Helper to show alert banner
  const showBanner = (msg, success = true) => {
    setMessage(msg);
    setIsSuccess(success);
    setTimeout(() => setMessage(''), 4000);
  };

  // Search Filter
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredHostels(hostels);
      return;
    }
    const filtered = hostels.filter(item => 
      item.hostelName.toLowerCase().includes(query.toLowerCase()) ||
      item.roomType.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredHostels(filtered);
  };

  // Book a Hostel (User Action)
  const handleBookNow = async (hostelId) => {
    if (!user) return;
    setActionLoading(true);
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const res = await axios.post('${import.meta.env.VITE_API_URL}/api/bookings', { hostelId }, { headers });
      showBanner(res.data.message || 'Booking requested successfully!', true);
      // Refresh list to update bookings and rooms available
      fetchData();
    } catch (err) {
      console.error(err);
      showBanner(err.response?.data?.message || 'Failed to request booking.', false);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a Hostel (Host Action)
  const handleDeleteHostel = async (id) => {
    if (!user || !window.confirm("Are you sure you want to delete this listing?")) return;
    setActionLoading(true);
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/hostels/${id}`, { headers });
      showBanner('Hostel deleted successfully!', true);
      fetchData();
    } catch (err) {
      console.error(err);
      showBanner(err.response?.data?.message || 'Failed to delete listing.', false);
    } finally {
      setActionLoading(false);
    }
  };

  // Manage Bookings (Host Action: Accept/Reject)
  const handleUpdateBookingStatus = async (bookingId, status) => {
    if (!user) return;
    setActionLoading(true);
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`, { status }, { headers });
      showBanner(`Booking ${status.toLowerCase()} successfully!`, true);
      fetchData();
    } catch (err) {
      console.error(err);
      showBanner(err.response?.data?.message || 'Failed to update booking status.', false);
    } finally {
      setActionLoading(false);
    }
  };

  // AI Assistant Interaction
  const handleAiSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');
    setAiLoading(true);

    try {
      const res = await axios.post('${import.meta.env.VITE_API_URL}/api/ai/chat', { message: userMessage });
      setChatMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Error connecting to the AI helper. Please check that the server is running.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  if (authLoading || !user) {
    return <div className="loading-state"><p>Loading session...</p></div>;
  }

  return (
    <div className="dashboard-container">
      {/* Alert banner */}
      {message && (
        <div className={`alert-banner ${isSuccess ? 'success' : 'error'} slide-down`}>
          {isSuccess ? <FaCheckCircle /> : <FaTimesCircle />} <span>{message}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="dashboard-header">
        <h1>{user.role === 'owner' ? 'Host Control Panel' : 'Available Accommodations'}</h1>
        <p>Manage listings, explore stays, and secure bookings all in one place.</p>
      </div>

      {/* OWNER/HOST DASHBOARD */}
      {user.role === 'owner' && (
        <div className="owner-dashboard">
          <div className="dashboard-tabs">
            <button 
              className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
              onClick={() => setActiveTab('properties')}
            >
              <FaStore /> My Properties
            </button>
            <button 
              className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <FaClipboardList /> Booking Requests 
              {bookings.filter(b => b.status === 'Pending').length > 0 && (
                <span className="badge-alert">
                  {bookings.filter(b => b.status === 'Pending').length}
                </span>
              )}
            </button>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading listings...</div>
          ) : activeTab === 'properties' ? (
            <div className="tab-content fade-in">
              <div className="action-row">
                <input 
                  type="text" 
                  placeholder="Search your listings..." 
                  value={searchQuery}
                  onChange={handleSearch}
                  className="search-input"
                />
                <Link to="/add">
                  <button className="btn-add-new">
                    <FaPlus /> Add Hostel
                  </button>
                </Link>
              </div>

              {filteredHostels.length === 0 ? (
                <div className="empty-state">
                  <p>No listings found. Click "Add Hostel" to list your first PG stay!</p>
                </div>
              ) : (
                <div className="dashboard-grid">
                  {filteredHostels.map((item) => (
                    <div className="listing-card" key={item._id}>
                      <div className="card-image-wrapper">
                        <img src={item.imgUrl} alt={item.hostelName} />
                        <span className="price-tag">₹{item.price}/mo</span>
                      </div>
                      <div className="card-details">
                        <h3>{item.hostelName}</h3>
                        <p className="card-meta">Type: <strong>{item.roomType}</strong></p>
                        <p className="card-meta">Rooms Available: <strong className={item.roomsAvail > 0 ? 'avail' : 'full'}>{item.roomsAvail}</strong></p>
                      </div>
                      <div className="card-actions">
                        <Link to={`/edit/${item._id}`}>
                          <button className="btn-edit"><FaEdit /> Edit</button>
                        </Link>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteHostel(item._id)}
                          disabled={actionLoading}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="tab-content fade-in">
              <h2>Booking Management</h2>
              {bookings.length === 0 ? (
                <div className="empty-state">
                  <p>No bookings received yet for your listings.</p>
                </div>
              ) : (
                <div className="bookings-table-wrapper">
                  <table className="bookings-table">
                    <thead>
                      <tr>
                        <th>Hostel Name</th>
                        <th>Guest Name</th>
                        <th>Guest Email</th>
                        <th>Date Requested</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="booking-row">
                          <td><strong>{booking.hostelId?.hostelName || 'Unknown Hostel'}</strong></td>
                          <td>{booking.userId?.name || 'Anonymous'}</td>
                          <td>{booking.userId?.email || 'N/A'}</td>
                          <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${booking.status.toLowerCase()}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td>
                            {booking.status === 'Pending' ? (
                              <div className="booking-action-buttons">
                                <button 
                                  className="btn-approve"
                                  onClick={() => handleUpdateBookingStatus(booking._id, 'Confirmed')}
                                  disabled={actionLoading}
                                >
                                  <FaCheck /> Accept
                                </button>
                                <button 
                                  className="btn-reject"
                                  onClick={() => handleUpdateBookingStatus(booking._id, 'Rejected')}
                                  disabled={actionLoading}
                                >
                                  <FaTimes /> Reject
                                </button>
                              </div>
                            ) : (
                              <span className="completed-action-text">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* USER/GUEST DASHBOARD */}
      {user.role === 'user' && (
        <div className="user-dashboard">
          <div className="action-row">
            <input 
              type="text" 
              placeholder="Search by name, room type..." 
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          {loading ? (
            <div className="loading-spinner">Searching rooms...</div>
          ) : (
            <div className="user-content-split">
              <div className="listings-side">
                <h2>Browse Rooms ({filteredHostels.length})</h2>
                {filteredHostels.length === 0 ? (
                  <div className="empty-state">
                    <p>No accommodations match your search criteria.</p>
                  </div>
                ) : (
                  <div className="dashboard-grid">
                    {filteredHostels.map((item) => {
                      const hasBooked = myBookings.some(b => b.hostelId?._id === item._id);
                      return (
                        <div className="listing-card" key={item._id}>
                          <div className="card-image-wrapper">
                            <img src={item.imgUrl} alt={item.hostelName} />
                            <span className="price-tag">₹{item.price}/mo</span>
                          </div>
                          <div className="card-details">
                            <h3>{item.hostelName}</h3>
                            <p className="card-meta">Type: <strong>{item.roomType}</strong></p>
                            <p className="card-meta">Rooms Left: <strong className={item.roomsAvail > 0 ? 'avail' : 'full'}>{item.roomsAvail}</strong></p>
                          </div>
                          <div className="card-actions full-width">
                            <button 
                              className={`btn-book ${hasBooked ? 'booked' : ''}`}
                              onClick={() => handleBookNow(item._id)}
                              disabled={actionLoading || item.roomsAvail <= 0 || hasBooked}
                            >
                              <FaBookmark /> {hasBooked ? 'Requested' : item.roomsAvail <= 0 ? 'Sold Out' : 'Book Now'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sidebar displaying User's Bookings */}
              <div className="bookings-side fade-in">
                <div className="bookings-side-card">
                  <h2><FaClipboardList /> My Bookings ({myBookings.length})</h2>
                  {myBookings.length === 0 ? (
                    <p className="no-bookings-txt">You haven't requested any stays yet. Click "Book Now" on a card to begin.</p>
                  ) : (
                    <div className="my-bookings-list">
                      {myBookings.map((b) => (
                        <div className="my-booking-item" key={b._id}>
                          <div>
                            <h4>{b.hostelId?.hostelName || 'Hostel Listing'}</h4>
                            <p className="booking-date">Requested on {new Date(b.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`status-badge-mini ${b.status.toLowerCase()}`}>
                            {b.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FLOATING AI CHAT ASSISTANT (Accessible to regular users to find recommendations) */}
      {user.role === 'user' && (
        <div className="ai-chatbot-wrapper">
          {isChatOpen ? (
            <div className="chat-window slide-up">
              <div className="chat-header">
                <div className="chat-header-title">
                  <FaRobot />
                  <div>
                    <h4>Hostify AI Assistant</h4>
                    <span>Online recommendation helper</span>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="btn-chat-close">
                  <FaTimes />
                </button>
              </div>

              <div className="chat-messages-container">
                {chatMessages.map((msg, index) => (
                  <div className={`chat-message ${msg.sender}`} key={index}>
                    <div className="chat-bubble">
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="chat-message ai">
                    <div className="chat-bubble loading-dots">
                      <span>AI is matching options...</span>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleAiSend} className="chat-input-bar">
                <input 
                  type="text" 
                  placeholder="Ask for PGs near a budget..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={aiLoading}
                />
                <button type="submit" className="btn-chat-send" disabled={aiLoading || !chatInput.trim()}>
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          ) : (
            <button 
              className="chat-toggle-btn pulse-animation"
              onClick={() => setIsChatOpen(true)}
            >
              <FaRobot /> <span className="tooltip-text">Ask AI</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default MainPage;
