import React, { useContext, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SetIsLoggedinContext, IsLoggedinContext } from '../App';
import axios from 'axios';
import './navbar.css';

const Navbar = () => {
  const isLoggedin = useContext(IsLoggedinContext);
  const setIsLoggedinContext = useContext(SetIsLoggedinContext);
  const navigate = useNavigate();

  const Logout = useCallback(() => {
    axios.post('http://localhost:3001/logout', { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          setIsLoggedinContext(false); // Update context for logged-out state
          window.localStorage.setItem("isLoggedin", "false"); // Update local storage
          navigate('/login'); // Redirect to login page
        }
      })
      .catch(error => {
        console.log("Error Logging Out: ", error);
      });
  }, [setIsLoggedinContext, navigate]);

  // Debugging: Log the isLoggedin state
  useEffect(() => {
    // console.log("isLoggedin state changed:", isLoggedin);
  }, [isLoggedin]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <Link className="navbar-brand mb-0 h1" to="/">
        <img
          src={require("./LifeDropP.png")}
          width={150}
          height={80}
          className="d-inline-block align-top"
          alt=""
        />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          {isLoggedin && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/home">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/findDonors">
                  Find Donors
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/request">
                  Blood Requests
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/bloodbanks">
                  Blood Banks
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contactus">
                  Contact Us
                </Link>
              </li>
            </>
          )}
        </ul>
        <div className="ml-auto">
          {isLoggedin ? (
            <Link to="/" onClick={Logout} className="btn btn-outline-danger ml-3 mr-3">
              Logout
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-outline-danger mr-4">
                Sign-Up
              </Link>
              <Link to="/login" className="btn btn-outline-danger mr-3">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
