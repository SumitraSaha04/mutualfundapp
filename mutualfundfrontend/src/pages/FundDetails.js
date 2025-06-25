// src/pages/FundDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function FundDetails() {
  const { id } = useParams();
  const [fund, setFund] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`https://api.mfapi.in/mf/${id}`)
      .then(res => setFund(res.data))
      .catch(() => setMessage('Error fetching fund details'));
  }, [id]);

  const handleSave = () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login to save funds.');

    axios.post('http://localhost:5000/api/funds/save', {
      schemeCode: fund.meta.scheme_code, schemeName: fund.meta.scheme_name
    }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => alert('Fund saved successfully!'))
      .catch(err => alert('Failed to save fund: ' + err.message));
  };

  return (
    <div style={{ backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      <div className="container py-4">
        {fund ? (
          <>
            <div className="card p-4 shadow-sm">
              <h3>{fund.meta.scheme_name}</h3>
              <p><strong>Scheme Code:</strong> {fund.meta.scheme_code}</p>
              <p><strong>Fund House:</strong> {fund.meta.fund_house || 'N/A'}</p>
              <button className="btn mb-3" style={{ backgroundColor: '#002244', color: 'white' }} onClick={handleSave}>
                Save Fund
              </button>
              <hr />
              <h5>Recent NAVs:</h5>
              <ul className="list-group">
                {fund.data.slice(0, 5).map((item, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between">
                    <strong>{item.date}</strong>
                    <span>₹{item.nav}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : <p className="text-center">{message || 'Loading fund details...'}</p>}
      </div>
    </div>
  );
}

export default FundDetails;
