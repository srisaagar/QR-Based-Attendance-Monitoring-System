import React from 'react';
import './websitestyle.css';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Website = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>College Website</title>

      <header className="header">
      <div className="container">
      <div className="logo">
        <a href="http://10.10.1.15:3000">
      <img src="https://msrit-bucket.s3.us-west-2.amazonaws.com/brand.png" alt="MSRIT Logo" />
      </a>
    </div>


    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
      <i className="fas fa-bars"></i>
    </button>

    <nav className={`nav ${menuOpen ? 'open' : ''}`}>
      <ul>
        <li><a href="https://msrit.edu/about-us.html">About Us</a></li>
        <li><a href="https://msrit.edu/admissions.html">Admissions</a></li>
        <li><a href="https://msrit.edu/department/cse.html">Academics</a></li>
        <li><a href="https://msrit.edu/research/rnd.html">Research</a></li>
        <li><a href="https://msrit.edu/facilities/e-learning.html">Facilities</a></li>
        <li><a href="https://msrit.edu/examination.html#exam-section">Examination</a></li>
        <li><a href="https://msrit.edu/placement.html">Placement</a></li>
        <li><a href="https://nikithhostelms.onrender.com">Hostel</a></li>
      </ul>
    </nav>

    <div className="header-actions">
      <i className="fas fa-search" />
      <i className="fas fa-user-circle" />
      <div className="dropdown">
        <button className="dropdown-toggle">Login</button>
        <div className="dropdown-menu">
          <Link to="/admin-login">Admin Portal</Link>
          <Link to="/teacher-login">Teacher Portal</Link>
        </div>
      </div>
    </div>
  </div>
</header>


      <section className="hero-section">
        <div className="overlay" />
        <div className="hero-content">
          <a href="https://msrit.edu/admissions.html">
          <img src="https://msrit-bucket.s3.us-west-2.amazonaws.com/Banner/Admission+open+copy-6.jpg" alt="" />
          </a>
        </div>
      </section>

      <section className="programs-section">
        <div className="container">
          <h2>Find the Right Programme for You</h2>
          <div className="program-selector">
            <select name="campus" id="campus">
              <option value="">Select Campus</option>
            </select>
            <select name="disciplines" id="disciplines">
              <option value="">Select Disciplines</option>
            </select>
            <select name="levels" id="levels">
              <option value="">Select Levels</option>
            </select>
            <button className="find-program-btn">Find Programme</button>
          </div>

          <div className="program-cards">
            {/* Card 1 */}
            <div className="card">
              <img
                src="https://images.shiksha.com/mediadata/images/1642105676phpg5zSQb.jpeg"
                alt="Technology"
              />
              <p><b>24</b> Programmes</p>
              <h3>Ramaiah Institute of Technology</h3>
              <p><b>75th Rank in India (Engineering)</b></p>
            </div>

            {/* Card 2 */}
            <div className="card">
              <img
                src="https://enrollacademy.com/wp-content/uploads/2022/08/2022-08-09.jpg"
                alt="Management"
              />
              <p><b>4</b> Programmes</p>
              <h3>Ramaiah Institute of Management</h3>
            </div>

            {/* Card 3 */}
            <div className="card">
              <img
                src="https://www.joonsquare.com/usermanage/image/business/m-s-ramaiah-school-of-architecture-bengaluru-rural-44400/m-s-ramaiah-school-of-architecture-bengaluru-rural-ramaiah-04.jpg"
                alt="Architecture"
              />
              <p><b>3</b> Programmes</p>
              <h3>Ramaiah School Of Architecture</h3>
              <p><b>21st Rank in India (Architecture)</b></p>
            </div>
          </div>
        </div>
      </section>

      <section className="accreditation-section">
        <div className="container">
          <h2>Accreditation & Rankings</h2>
          <div className="rankings-grid">
            <div className="ranking-card"><h3>A+ Grade</h3><p>by NAAC</p></div>
            <div className="ranking-card"><h3>60</h3><p>Industrial collaborations</p></div>
            <div className="ranking-card"><h3>700</h3><p>Avg. Publications Per Year</p></div>
            <div className="ranking-card"><h3>95%</h3><p>Placement Percentage</p></div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <h2>OUR VALUES</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>QUALITY & EXCELLENCE</h3>
              <p>We are devoted to provide quality education and excellence in all our endeavors.</p>
            </div>
            <div className="stat-item">
              <h3>RESEARCH & INNOVATION</h3>
              <p>We are committed to provide infrastructure and support for quality research and product development.</p>
            </div>
            <div className="stat-item">
              <h3>FREEDOM OF EXPRESSION</h3>
              <p>We support academic freedom and the free exchange of ideas in a constructive environment.</p>
            </div>
            <div className="stat-item">
              <h3>ETHICS IN ENGINEERING</h3>
              <p>We instill ethical values that guide professional practice and personal conduct.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="latest-news-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <i className="fas fa-bookmark" />
              <h2>LATEST NEWS</h2>
            </div>
            <a href="#" className="see-more">SEE MORE</a>
          </div>

          <div className="news-grid">
            {/* Repeat for each news item */}
            {[
              { date: '30 JUL', title: 'First year UG COURSE B.E & B.ARCH fees structure 2025-2026' },
              { date: '29 JUL', title: 'Semester End Examinations- PGI Semester 2024 batch August 2025' },
              { date: '25 JUL', title: 'Academic Calendar for 3 and 4 Sem MBA Program 2025-26' },
              { date: '21 JUL', title: 'Higher Semester (UG-PG coures) Fees Structure for 2025-2026' },
              { date: '19 JUL', title: 'Supplementary Semester Classes Aug/Sept 2025' },
              { date: '5 JUL', title: 'FEE NOTIFICATION FOR SEMESTER END EXAMINATIONS - AUGUST 2025' },
            ].map((item, idx) => (
              <div className="news-item" key={idx}>
                <div className="news-date">
                  <span className="year">2025</span>
                  <span className="day-month">{item.date}</span>
                </div>
                <div className="news-content">
                  <p>{item.title}</p>
                  <a href="https://drive.google.com/file/d/1_rjbah8_jGjxW0ZKk_ATZKgbFFvNX-KC/view?usp=sharing" className="read-more">
                    READ MORE <i className="fas fa-arrow-circle-right" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-links" />
          <div className="social-media">
            <p>Connect with us</p>
            <a href="https://www.facebook.com/RamaiahInstituteofTechnologyRIT"><i className="fab fa-facebook-f" /></a>
            <a href="#"><i className="fab fa-instagram" /></a>
            <a href="https://www.youtube.com/c/RamaiahInstituteofTechnology"><i className="fab fa-youtube" /></a>
            <a href="https://www.linkedin.com/school/m.s.-ramaiah-institute-of-technology/posts/?feedView=all"><i className="fab fa-linkedin-in" /></a>
          </div>
        </div>
        <div className="copyright">© 2025  Ramaiah Institute of Technology. All rights reserved.</div>
      </footer>
    </>
  );
};

export default Website;