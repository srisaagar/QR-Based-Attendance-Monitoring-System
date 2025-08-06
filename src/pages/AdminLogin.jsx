import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { username, password });
      localStorage.setItem('adminLoggedIn', 'true');
      alert(res.data.message || 'Admin logged in');
      navigate('/admin-dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.page}>
      {/* ✅ Top-left college logo */}
      <a href="http://localhost:3000">
      <img
        src="https://d2e9h3gjmozu47.cloudfront.net/brand.png" // 👉 Replace this path with your actual white logo path (e.g. /assets/logo.png)
        alt="College Logo"
        style={styles.logo}
      />
      </a>

      <style>
        {`
          @keyframes fadeSlideUp {
            0% {
              opacity: 0;
              transform: translateY(40px) scale(0.95);
            }
            100% {
              opacity: 1;
              transform: translateY(0px) scale(1);
            }
          }

          .login-card:hover {
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
            transform: scale(1.02);
            transition: all 0.3s ease-in-out;
          }

          input:hover, input:focus {
            background: rgba(255, 255, 255, 0.25);
            transition: background 0.3s ease-in-out;
          }

          input::placeholder {
            color: #eeeeee; /* 💡 Change this to any color you want */
            opacity: 0.85;
          }

          button:hover {
            background: linear-gradient(to right, #ff6a00, #ee0979);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 105, 135, 0.3);
          }
        `}
      </style>

      <form onSubmit={handleLogin} className="login-card" style={styles.card}>
        <h2 style={styles.title}>🎓 Admin Login</h2>
        <p style={styles.subtitle}>Secure QR Attendance Portal</p>

        <input
          type="text"
          placeholder="👤 Username"
          className="admindash"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="🔒 Password"
          className="admindash"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Login</button>

        <p style={styles.footer}>© 2025 College QR Attendance System</p>
      </form>
    </div>
  );
};

const styles = {
  page: {
    margin: 0,
    padding: 0,
    fontFamily: 'Poppins, sans-serif',
    background: 'linear-gradient(135deg, #1e1e60, #3f87a6)',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  logo: {
    position: 'absolute',
    top: '30px',
    left: '40px',
    height: '60px',
  },
  card: {
    width: '380px',
    padding: '35px',
    borderRadius: '25px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    color: '#fff',
    animation: 'fadeSlideUp 1s ease forwards',
    transition: 'transform 0.3s ease-in-out',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#ffffff',
    textShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  subtitle: {
    fontSize: '0.95rem',
    marginBottom: '30px',
    color: '#e0e0e0',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    marginBottom: '18px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'background 0.3s ease',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(to right, #ee0979, #ff6a00)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.3s ease-in-out',
  },
  footer: {
    marginTop: '25px',
    fontSize: '0.85rem',
    color: '#d0d0d0',
    letterSpacing: '0.5px',
  },
};

export default AdminLogin;



