import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import './HomePage.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (!user) {
      axios.get('http://localhost:3001/user', { withCredentials: true })
        .then(response => {
          if (response.data.user) {
            setUser(response.data.user);
            setUsername(response.data.user.name);
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setFetchError('Failed to fetch user data. Please try again later.');
        })
        .finally(() => setLoading(false));
    } else {
      setUsername(user.name);
      setLoading(false);
    }
  }, [user, setUser]);

  return (
    <>
      <link
        href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        rel="stylesheet"
        id="bootstrap-css"
      />
      <div className="homepage-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {fetchError && <div className="alert alert-danger">{fetchError}</div>}
            <h1>Welcome {username || 'Guest'}</h1>
            <br />
            <br />
            <div className="container container-rounded" style={{ maxWidth: 1200 }}>
              <div className="card text-white bg-dark mb-3">
                <section className="statistics-section">
                  <div className="stats">
                    <div className="stat-item">
                      <h3>1000+</h3>
                      <p>Available Donors</p>
                    </div>
                    <div className="stat-item">
                      <h3>200+</h3>
                      <p>Lives Saved</p>
                    </div>
                    <div className="stat-item">
                      <h3>150+</h3>
                      <p>Requests Fulfilled</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            {/* Footer Section */}
            <footer className="footer-section">
              <div className="footer-links">
                <Link to="/contactUs">Contact Us</Link>
                <Link to="/about">About</Link>
              </div>
              <div className="social-media">
                <p className='social-media'>&copy;LifeDrop</p>
              </div>
            </footer>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
