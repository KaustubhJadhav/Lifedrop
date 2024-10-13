import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SetIsLoggedinContext } from '../App'; // Import the SetIsLoggedinContext from App.js
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const { setUser } = useContext(UserContext); // User context to set user data
  const setIsLoggedin = useContext(SetIsLoggedinContext); // Context to manage the isLoggedin state
  const [email, setEmail] = useState(''); // Email state
  const [password, setPassword] = useState(''); // Password state
  const [error, setError] = useState(''); // Error state
  const navigate = useNavigate(); // For navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make a POST request to the backend for login
    axios.post('http://localhost:3001/login', { email, password }, {
      withCredentials: true // Important to send cookies for session management
    })
      .then(result => {
        if (result.data === "SUCCESS") {
          // If login is successful, fetch the user data from backend
          return axios.get('http://localhost:3001/user', { withCredentials: true });
        } else {
          throw new Error('Login failed');
        }
      })
      .then(response => {
        if (response.data.user) {
          setUser(response.data.user); // Set the user in context
          setIsLoggedin(true); // Set the isLoggedin state to true
          window.localStorage.setItem("isLoggedin", true); // Optionally store it in localStorage

          // Navigate to the home page with the user state
          navigate('/home', { state: { user: response.data.user } });
        }
      })
      .catch(err => {
        console.log(err);
        setError('Invalid email or password'); // Show error if login fails
      });
  };

  return (
    <>
      <link
        href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        rel="stylesheet"
        id="bootstrap-css"
      />
      <link
        rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.0.8/css/all.css"
      />
      <br />
      <br />
      <br />
      <div className="container" style={{ maxWidth: 500 }}>
        <div className="card bg-dark text-white">
          <article className="card-body mx-auto" style={{ maxWidth: 300 }}>
            <h4 className="card-title mt-3 text-center">Log in to your Account</h4>
            <p className="text-center">Welcome to LifeDrop</p>
            {error && <div className="alert alert-danger">{error}</div>} {/* Display error message if login fails */}
            <form onSubmit={handleSubmit}>
              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fa fa-envelope" />
                  </span>
                </div>
                <input
                  className="form-control"
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state
                  required
                />
              </div>
              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fa fa-lock" />
                  </span>
                </div>
                <input
                  className="form-control"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update password state
                  required
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary btn-block">
                  Login
                </button>
              </div>
              <p className="text-center">
                Don't have an account? <Link to="/signup">Sign-Up</Link>
              </p>
            </form>
          </article>
        </div>
      </div>
      <br />
      <br />
    </>
  );
};

export default Login;
