import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
  });

  const departments = [
    'Computer Science and Engineering',
    'Information Science and Engineering',
    'Electrical Science and Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
  ];

  const fetchTeachers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/teachers');
      setTeachers(res.data);
    } catch (err) {
      alert('Error fetching teachers');
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    const {  name,password ,email,department } = newTeacher;

    if (!email.endsWith('@msrit.edu')) {
      alert('Please enter a valid @msrit.edu email address');
      return;
    }

    if (!department) {
      alert('Please select a department');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/teachers', newTeacher);
      alert('Teacher added');
      setNewTeacher({ name: '', email: '', password: '', department: '' });
      fetchTeachers();
      if (selectedDepartment) {
        setFilteredTeachers(
          teachers.filter((t) => t.department === selectedDepartment)
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding teacher');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/teachers/${id}`);
      alert('Teacher deleted');
      fetchTeachers();
      if (selectedDepartment) {
        setFilteredTeachers(
          teachers.filter((t) => t.department === selectedDepartment)
        );
      }
    } catch (err) {
      alert('Error deleting teacher');
    }
  };

  const handleDepartmentClick = (dept) => {
    setSelectedDepartment(dept);
    setFilteredTeachers(teachers.filter((t) => t.department === dept));
  };

  const handleGoBack = () => {
    setSelectedDepartment(null);
    setFilteredTeachers([]);
  };

  return (
    <div className="admin-dashboard-page">
      <img
        src="https://d2e9h3gjmozu47.cloudfront.net/brand.png"
        alt="Logo"
        className="admin-logo"
      />

      <div className="top-right-btn">
        <button className="go-to-login-btn" onClick={() => navigate('/admin-login')}>
          Logout
        </button>
      </div>

      <div className="admin-dashboard-wrapper">
        {/* Add Teacher Form */}
        <form className="admin-form-card" onSubmit={handleAddTeacher}>
          <h2>Add New Teacher</h2>
          <input
            type="text"
            placeholder="👤 Name"
            className="admindash"
            value={newTeacher.name}
            onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="📧 Email"
            className="admindash"
            value={newTeacher.email}
            onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="🔒 Password"
            className="admindash"
            value={newTeacher.password}
            onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
            required
          />
          <select
            value={newTeacher.department}
            onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
            required
          >
            <option value="">🏫 Select Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <button type="submit">Add Teacher</button>
        </form>

        {/* Department / Teacher View */}
        <div className="admin-table-card">
          {!selectedDepartment ? (
            <>
              <h2>Departments</h2>
              <div className="dept-grid-layout">
                <div className="dept-row top-row">
                  <button className="dept-btn" onClick={() => handleDepartmentClick(departments[0])}>
                    {departments[0]}
                  </button>
                  <button className="dept-btn" onClick={() => handleDepartmentClick(departments[1])}>
                    {departments[1]}
                  </button>
                </div>
                <div className="dept-row middle-row">
                  <button className="dept-btn" onClick={() => handleDepartmentClick(departments[2])}>
                    {departments[2]}
                  </button>
                  <button className="dept-btn" onClick={() => handleDepartmentClick(departments[3])}>
                    {departments[3]}
                  </button>
                </div>
                <div className="dept-row bottom-row">
                  <button className="dept-btn" onClick={() => handleDepartmentClick(departments[4])}>
                    {departments[4]}
                  </button>
                  <button className="dept-btn" onClick={() => handleDepartmentClick(departments[5])}>
                    {departments[5]}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="top-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ color: '#fff' }}>Teachers in {selectedDepartment}</h3>
                <button className="go-to-back-btn" onClick={handleGoBack}>
                  Go Back
                </button>
              </div>

              {filteredTeachers.length === 0 ? (
                <p className="no-teachers">No teachers found in this department.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((teacher) => (
                      <tr key={teacher._id}>
                        <td>
                          <div className="teacher-avatar">👤</div>
                        </td>
                        <td>{teacher.name}</td>
                        <td>{teacher.email}</td>
                        <td>{teacher.department}</td>
                        <td>
                          <button
                            onClick={() => handleDelete(teacher._id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
