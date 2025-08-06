import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // External CSS for styling

const TeacherLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/teachers/login', {
        email,
        password,
      });

      localStorage.setItem('teacherToken', res.data.token);
      localStorage.setItem('teacherName', res.data.teacher.name);
      localStorage.setItem('teacherId', res.data.teacher._id);

      alert('✅ Login successful!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || '❌ Login failed');
    }
  };

  return (
    <div className="teacher-login-page">
      {/* Top-left Logo */}
      <a href="/">
        <img
          src="https://d2e9h3gjmozu47.cloudfront.net/brand.png"
          alt="College Logo"
          className="teacher-logo"
        />
      </a>

      <form onSubmit={handleLogin} className="teacher-login-card">
        <h2 className="teacher-title">👩‍🏫 Teacher Login</h2>
        <p className="teacher-subtitle">Access Your Dashboard</p>

        <input
          type="email"
          placeholder="📧 Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="teacher-input"
          required
        />

        <input
          type="password"
          placeholder="🔐 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="teacher-input"
          required
        />

        <button type="submit" className="teacher-button">
          Login
        </button>

        <p className="teacher-footer">© 2025 College QR Attendance System</p>
      </form>
    </div>
  );
};

export default TeacherLogin;
