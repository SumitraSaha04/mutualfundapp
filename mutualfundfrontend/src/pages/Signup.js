// src/pages/Signup.js
import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: ''
  });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Signup successful!");
    } catch (err) {
      alert("Signup failed: User may already exist.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-3">Signup</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" className="form-control my-2" placeholder="Username" onChange={handleChange} required />
          <input type="email" name="email" className="form-control my-2" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" className="form-control my-2" placeholder="Password" onChange={handleChange} required />
          <button type="submit" className="btn w-100" style={{ backgroundColor: '#002244', color: 'white' }}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
