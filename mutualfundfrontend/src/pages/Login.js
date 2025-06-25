// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      const { token, username, email } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username, email }));

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" className="form-control my-2" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" className="form-control my-2" placeholder="Password" onChange={handleChange} required />
          <button type="submit" className="btn w-100" style={{ backgroundColor: '#002244', color: 'white' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
