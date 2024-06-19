import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MainPage() {
  const apiUrl = 'http://localhost:8080/';
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  const filterData = (event) => {
    const query = event.target.value;
    if (query.trim() === '') {
      setData(originalData); 
      return;
    }
    const filteredData = originalData.filter((item) => {
      return item.hostelName.toLowerCase().includes(query.toLowerCase());
    });
    setData(filteredData);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        if (Array.isArray(response.data)) {
          setData(response.data);
          setOriginalData(response.data); 
        } else {
          console.error('Invalid data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [apiUrl]);

  const sortedData = [...data].sort((a, b) => a.id - b.id);

  return (
    <>
      <div className="container">
      <div className="main">
        <div className="bar">
          <div className="head">
            <h3>Account</h3>
            <h3>Language</h3>
            <h3>Help</h3>
            <h3>Features</h3>
            <h3>Facilities</h3>
          </div>
        </div>

        <div className="data">
        <input type="text" placeholder='Search...' onChange={filterData} />
        <div className="button">
          <Link to='/add'><button style={{backgroundColor: 'green', color: 'white'}} >Add +</button></Link>
        </div>
        </div>

        <div className="card-container">
          
          {sortedData && sortedData.map((item, index) => {
            return (
              <div className="card" key={index}>
                <div className="delete">
                  <button>Delete</button>
                </div>
                <div>
                  <h3>Hostel : {item.hostelName}</h3>
                  <p>Available Rooms : {item.roomsAvail}</p>
                  <p>Room Type : {item.roomType}</p>
                  <p>Price : {item.price}</p>
                  <img src={item.imgUrl} alt="" />
                </div>
                <div className='btn2'>
                  <button className='book'>Book Now</button>
                  <button className='edit'>Edit</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      </div>
    </>
  )
}

export default MainPage;