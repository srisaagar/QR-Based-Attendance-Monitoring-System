import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [teacher, setTeacher] = useState({});
  const [sessionId, setSessionId] = useState(localStorage.getItem('activeSessionId') || null);
  const [form, setForm] = useState({ className: '', subject: '', hour: '', date: '' });
  const [students, setStudents] = useState([]);
  const [historySessions, setHistorySessions] = useState([]);
  const [expandedSession, setExpandedSession] = useState(null);
  const [manualStudent, setManualStudent] = useState({ name: '', rollNo: '' });
  const [localIP, setLocalIP] = useState('');
  const [qrValue, setQrValue] = useState('');

  const token = localStorage.getItem('teacherToken');

  const handleEndSession = () => {
    localStorage.removeItem('activeSessionId');
    setSessionId(null);
    setStudents([]);
    setQrValue('');
  };
  const handleLogout = () => {
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('activeSessionId');
    window.location.href = '/teacher-login';
  };

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/utils/my-ip');
        setLocalIP(res.data.ip);
      } catch (err) {
        console.error('Failed to fetch IP:', err);
      }
    };
    fetchIP();
  }, []);

  useEffect(() => {
    if (sessionId && localIP) {
      setQrValue(`http://${localIP}:3000/attendance/${sessionId}?t=${Date.now()}`);
    }
  }, [sessionId, localIP]);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/teachers/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeacher(res.data);
      } catch (err) {
        console.error('Failed to fetch teacher:', err);
      }
    };
    fetchTeacher();
  }, [token]);

  useEffect(() => {
    if (!sessionId) return;

    const fetchStudents = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/attendance/${sessionId}`);
        setStudents(res.data.students || []);
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    };

    fetchStudents();
    const interval = setInterval(fetchStudents, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !localIP) return;

    const refreshQR = async () => {
      try {
        await axios.put(`http://localhost:5000/api/attendance/refresh-qr/${sessionId}`);
        setQrValue(`http://${localIP}:3000/attendance/${sessionId}?t=${Date.now()}`);
      } catch (error) {
        console.error('Failed to refresh QR code', error);
        if (error.response && error.response.status === 404) {
          console.log('Stale session ID detected. Clearing session.');
          handleEndSession();
        }
      }
    };

    const interval = setInterval(refreshQR, 10000);
    return () => clearInterval(interval);
  }, [sessionId, localIP]);

  useEffect(() => {
    if (!teacher._id) return;
    const fetchAttendanceHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/attendance/teacher/${teacher._id}`);
        setHistorySessions(res.data);
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    };
    fetchAttendanceHistory();
  }, [teacher._id]);

  const handleCreateSession = async () => {
    const { className, subject, hour, date } = form;
    if (!className || !subject || !hour || !date) {
      alert('All fields are required');
      return;
    }
    if (!localIP) {
      alert('Network IP not available yet. Please wait a moment and try again.');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/attendance/create',
        { ...form, teacherId: teacher._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newSessionId = res.data._id;
      setSessionId(newSessionId);
      localStorage.setItem('activeSessionId', newSessionId);
      setQrValue(`http://${localIP}:3000/attendance/${newSessionId}?t=${Date.now()}`);
      setForm({ className: '', subject: '', hour: '', date: '' });
    } catch (err) {
      console.error('Session creation failed:', err);
      alert('Failed to start session.');
    }
  };

  const handleAddStudent = async () => {
    if (!manualStudent.name || !manualStudent.rollNo) return alert('Enter all fields');
    try {
      await axios.post('http://localhost:5000/api/attendance/student/manual-add', {
        sessionId,
        name: manualStudent.name,
        rollNo: manualStudent.rollNo,
      });
      setManualStudent({ name: '', rollNo: '' });
    } catch (err) {
      console.error('Error adding student:', err);
      alert('Failed to add student');
    }
  };

  const handleDeleteStudent = async (rollNo) => {
    try {
      await axios.put(`http://localhost:5000/api/attendance/${sessionId}/remove-student`, { rollNo });
      setStudents(students.filter((s) => s.rollNo !== rollNo));
    } catch (err) {
      console.error('Error removing student:', err);
      alert('Failed to remove student');
    }
  };
  const handleDownloadCSV = (session) => {
    const classInfo = `Class Name:,${session.className}\nSubject:,${session.subject}\nDate:,${new Date(session.date).toLocaleDateString()}\nTime:,${new Date().toLocaleTimeString()}\n\n`;
    const headers = `Name,USN\n`;
    const rows = session.students.map(s => `${s.name},${s.rollNo}`).join('\n');
    const csvContent = `${classInfo}${headers}${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Attendance_${session.className}_${session.subject}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-container">
        <img
          src="https://d2e9h3gjmozu47.cloudfront.net/brand.png"
          alt="College Logo"
          className="college-logo"
        />

    <div className="dashboard-container">
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h1 className="dashboard-title heartbeat-text">
  Welcome <span className="teacher-name">{(teacher.name || 'Teacher').toUpperCase()}</span>
</h1>


      <div className="dashboard-grid">
        <div className="dashboard-card">
          {sessionId ? (
            <>
              <h3 className="section-title">QR Code - Live Session</h3>
              <div className="button-group">
              <button className="submit-button" onClick={() => setShowQrModal(true)}>
                Show QR
              </button>
              <button className="submit-button" onClick={handleEndSession}>
                End Session
              </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="section-title">Start New Attendance</h3>
              <input type="text" placeholder="Class" value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} className="form-input" />
              <input type="text" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="form-input" />
              <input type="text" placeholder="Hour" value={form.hour} onChange={(e) => setForm({ ...form, hour: e.target.value })} className="form-input" />
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="form-input" />
              <button className="submit-button" onClick={handleCreateSession}>
                Generate QR
              </button>
            </>
          )}
        </div>

        <div className="dashboard-card">
          <h3 className="section-title">Students Present ({students.length})</h3>
          {students.length === 0 ? (
            <p className="text-muted">No students scanned yet.</p>
          ) : (
            <ul className="student-list">
              {students.map((s, i) => (
                <li key={i} className="student-item">
                  {s.name} ({s.rollNo})
                  <button onClick={() => handleDeleteStudent(s.rollNo)} className="delete-student">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}

          {sessionId && (
            <div className="mt-4">
              <h4 className="section-title">Manual Entry</h4>
              <input type="text" placeholder="Name" value={manualStudent.name} onChange={(e) => setManualStudent({ ...manualStudent, name: e.target.value })} className="form-input" />
              <input type="text" placeholder="Roll No" value={manualStudent.rollNo} onChange={(e) => setManualStudent({ ...manualStudent, rollNo: e.target.value })} className="form-input" />
              <button onClick={handleAddStudent} className="submit-button">
                Add Student
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <h3 className="section-title large">📅 Attendance History</h3>
        {historySessions.length === 0 ? (
          <p className="text-muted">No previous sessions found.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Hour</th>
                <th>Students</th>
              </tr>
            </thead>
            <tbody>
              {historySessions.map((session) => (
                <React.Fragment key={session._id}>
                  <tr>
                    <td>{new Date(session.date).toLocaleDateString()}</td>
                    <td>{session.className}</td>
                    <td>{session.subject}</td>
                    <td>{session.hour}</td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        onClick={() =>
                          setExpandedSession(
                            expandedSession === session._id ? null : session._id
                          )
                        }
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {session.students.length}
                      </span>
                      <button className="download-button" onClick={() => handleDownloadCSV(session)}>
                        🡇
                      </button>
                    </td>
                  </tr>
                  {expandedSession === session._id && (
                    <tr>
                      <td colSpan="5" className="expanded-row">
                        <ul className="student-list">
                          {session.students.map((s, i) => (
                            <li key={i}>
                              {s.name} ({s.rollNo})
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showQrModal && (
        <div className="qr-modal-overlay" onClick={() => setShowQrModal(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="section-title">Scan to Mark Attendance</h3>
            {qrValue && <QRCodeCanvas value={qrValue} size={256} />}
            <button className="close-modal-button" onClick={() => setShowQrModal(false)}>
              Close
            </button>
            <p className="text-muted"><b>QR auto-refreshes every 10 seconds</b></p>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default TeacherDashboard;