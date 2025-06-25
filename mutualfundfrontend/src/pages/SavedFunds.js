// src/pages/SavedFunds.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SavedFunds() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/funds/saved', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setFunds(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = code => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:5000/api/funds/delete/${code}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => setFunds(f => f.filter(x => x.schemeCode !== code)))
      .catch(console.error);
  };

  return (
    <div style={{ backgroundColor: '#F5F5F5', minHeight: '100vh' }} className="container py-5">
      <h3 className="text-center mb-4">Your Saved Mutual Funds</h3>
      {loading ? <p className="text-center">Loading...</p> :
        funds.length === 0 ? (
          <div className="alert alert-info text-center">No saved funds yet.</div>
        ) : (
          <ul className="list-group mx-auto" style={{ maxWidth: '700px' }}>
            {funds.map(f => (
              <li key={f.schemeCode} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{f.schemeName}</strong><br />
                  <small className="text-muted">Code: {f.schemeCode}</small>
                </div>
                <button className="btn btn-sm" style={{ backgroundColor: '#002244', color: 'white' }} onClick={() => handleDelete(f.schemeCode)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}

export default SavedFunds;
