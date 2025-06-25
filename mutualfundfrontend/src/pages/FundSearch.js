// src/pages/FundSearch.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function FundSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const suggestionBoxRef = useRef();
  const [selectedCode, setSelectedCode] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      axios
        .get(`https://api.mfapi.in/mf/search?q=${query.trim()}`)
        .then((res) => setSuggestions(res.data.slice(0, 6)))
        .catch(() => setSuggestions([]));
    } else setSuggestions([]);
  }, [query]);

  const handleSearch = async () => {
    if (!selectedCode) return setMsg('Please select a fund from the suggestions.');
    setLoading(true);
    setMsg('');
    try {
      const res = await axios.get(`https://api.mfapi.in/mf/${selectedCode}`);
      setTimeout(() => {
        if (!res.data.meta.scheme_name) setMsg('No mutual fund found');
        else setResults([res.data]);
        setLoading(false);
      }, 1200);
    } catch {
      setMsg('Error fetching data');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSelect = (item) => {
    setQuery(item.schemeName);
    setSelectedCode(item.schemeCode);
    setSuggestions([]);
  };

  return (
    <div style={{ backgroundColor: '#F5F5F5', minHeight: '100vh' }} className="d-flex justify-content-center align-items-center">
      <div className="container text-center py-5" style={{ maxWidth: '750px' }}>
        <h2 className="mb-3 text-primary fw-semibold">Explore Mutual Funds</h2>
        <p className="fst-italic text-muted">"Mutual funds offer diversification, professional management, and trust."</p>
        <p className="fst-italic text-muted">"Every rupee invested today secures your tomorrow."</p>

        <div ref={suggestionBoxRef} className="position-relative mt-4">
          <form onSubmit={handleSubmit} className="input-group shadow-sm">
            <input
              type="text"
              className="form-control"
              placeholder="Search mutual fund by name..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedCode(null);
              }}
              required
            />
            <button type="submit" className="btn" style={{ backgroundColor: '#002244', color: 'white' }} disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm text-white" /> : 'Search'}
            </button>
          </form>

          {suggestions.length > 0 && (
            <ul className="list-group position-absolute w-100 z-3 mt-1 shadow" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {suggestions.map((item) => (
                <li
                  key={item.schemeCode}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSelect(item)}
                >
                  {item.schemeName} ({item.schemeCode})
                </li>
              ))}
            </ul>
          )}
        </div>

        {msg && <div className="alert alert-warning mt-3">{msg}</div>}

        {results.length > 0 && (
          <div className="row justify-content-center mt-4">
            {results.map((f) => (
              <div key={f.meta.scheme_code} className="col-md-10">
                <div className="card shadow-sm mb-3 text-start">
                  <div className="card-body">
                    <h5 className="card-title">{f.meta.scheme_name}</h5>
                    <p><strong>Scheme Code:</strong> {f.meta.scheme_code}</p>
                    <p><strong>Fund House:</strong> {f.meta.fund_house || 'N/A'}</p>
                    <Link
                      to={`/fund-details/${f.meta.scheme_code}`}
                      className="btn"
                      style={{ backgroundColor: '#002244', color: 'white' }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FundSearch;
