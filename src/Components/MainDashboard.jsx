import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext'; // Import UserContext to access user data
import './MainDashboard.css'; // Custom styles for MainDashboard

const MainDashboard = () => {
  const { user, setUser } = useContext(UserContext); // Get user data from UserContext
  const [notifications, setNotifications] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]); // State for accepted requests
  const [loading, setLoading] = useState(true); // Loading state
  const [fetchError, setFetchError] = useState(''); // Error state for fetching

  useEffect(() => {
    // Check if user data is already available in context
    if (!user) {
      // Fetch user data if not available
      axios.get('http://localhost:3001/user', { withCredentials: true })
        .then(response => {
          if (response.data.user) {
            setUser(response.data.user); // Set user data in context
            fetchDashboardData(response.data.user.name); // Fetch notifications and requests based on username
            console.log("Name: "+response.data.user.name); // Fetch notifications and requests based on username
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setFetchError('Failed to fetch user data. Please try again later.');
        })
        .finally(() => setLoading(false));
    } else {
      // If user data is already available, fetch notifications and accepted requests directly
      fetchDashboardData(user.name);
      setLoading(false);
    }
  }, [user, setUser]);

  // Function to fetch notifications and accepted requests
  const fetchDashboardData = (username) => {
    // Fetch notifications
    axios.get('http://localhost:3001/notifications', { withCredentials: true })
      .then(response => setNotifications(response.data))
      .catch(error => console.error('Error fetching notifications:', error));

    // Fetch accepted requests where donorName matches the logged-in user
    axios.get('http://localhost:3001/accepted-requests', {
      params: { donorName: username },
      withCredentials: true
    })
    .then(response => setAcceptedRequests(response.data))
    .catch(error => console.error('Error fetching accepted requests:', error));
  };

  const handleEmailContact = (email) => {
    window.location.href = `mailto:${email}`; // Open email client with pre-filled email address
  };

  const handleWhatsAppContact = (phoneNumber) => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank'); // Open WhatsApp chat
  };

  return (
    <>
      <link
        href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        rel="stylesheet"
        id="bootstrap-css"
      />
      <div className="container mt-4 ml-3">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {fetchError && <div className="alert alert-danger">{fetchError}</div>}
            <h2 className="mb-4">Main Dashboard</h2>

            <div className="row">
              {/* Notification Summary Section */}
              <div className="col-md-4">
                <h4>Notification Summary</h4>
                <ul className="list-group">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <li key={index} className="list-group-item">
                        {notification.message}
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">No notifications</li>
                  )}
                </ul>
              </div>

              {/* Accepted Requests Section */}
              <div className="col-md-7 offset-md-1">
                <h4>Accepted Requests</h4>
                <div className="row">
                  {acceptedRequests.length > 0 ? (
                    acceptedRequests.map((request, index) => (
                      <div key={index} className="col-md-6 mb-4">
                        <div className="card text-white bg-danger shadow rounded" style={{ width: '25rem' }}>
                          <div className="card-body">
                            <h5 className="card-title">Request Accepted</h5>
                            <p className="card-text">
                              <strong>Requested By:</strong> {request.userName} <br />
                              <strong>Email:</strong> {request.donorEmail} <br />
                              <strong>Phone Number:</strong> {request.donorPhoneNo} <br />
                              <strong>Location:</strong> {request.donorLocation} <br />
                              <strong>Date:</strong> {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                            <div className="d-flex justify-content-between">
                              <button 
                                className="btn btn-outline-light" 
                                onClick={() => handleEmailContact(request.donorEmail)}
                              >
                                Contact via Email
                              </button>
                              <button 
                                className="btn btn-outline-light" 
                                onClick={() => handleWhatsAppContact(request.donorPhoneNo)}
                              >
                                Contact via WhatsApp
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No accepted requests found.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default MainDashboard;
