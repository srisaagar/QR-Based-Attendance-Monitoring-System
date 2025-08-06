import React, { useState } from 'react';
import axios from 'axios';
import './StudentForm.css';

const StudentForm = () => {
  const [form, setForm] = useState({ name: '', rollNo: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/attendance/student/mark-attendance`, {
        qrData: window.location.href,
        name: form.name,
        rollNo: form.rollNo,
        deviceId: navigator.userAgent,
      });

      alert('Attendance marked successfully!');
      setSubmitted(true);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Error: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div className="student-form-page">
      <img
        src="https://d2e9h3gjmozu47.cloudfront.net/brand.png"
        alt="College Logo"
        className="student-logo"
      />

      {!submitted ? (
        <form onSubmit={handleSubmit} className="student-form-card">
          <h2 className="student-form-title">📝 Mark Your Attendance</h2>
          <p className="student-form-subtitle">Please enter your name and roll number</p>

          <input
            type="text"
            placeholder="👤 Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="student-form-input"
            required
          />
          <input
            type="text"
            placeholder="🎓 Roll No"
            value={form.rollNo}
            onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
            className="student-form-input"
            required
          />
          <button type="submit" className="student-form-button">Submit Attendance</button>
          <p className="student-form-footer">© 2025 College QR Attendance System</p>
        </form>
      ) : (
        <div className="thank-you-card">
          <h2>✅ Attendance Marked</h2>
          <p>Thank you! You may now close this tab.</p>
        </div>
      )}
    </div>
  );
};

export default StudentForm;