import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext'; // Import UserContext to access user data
import './MainDashboard.css'; // Custom styles for MainDashboard

const MainDashboard = () => {
  const { user, setUser } = useContext(UserContext); // Get user data from UserContext
  const [notifications, setNotifications] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]); // State for accepted requests
  const [userRequests, setUserRequests] = useState([]); // State for user's own requests
  const [loading, setLoading] = useState(true); // Loading state
  const [fetchError, setFetchError] = useState(''); // Error state for fetching

  useEffect(() => {
    if (!user) {
      axios.get('http://localhost:3001/user', { withCredentials: true })
        .then(response => {
          if (response.data.user) {
            setUser(response.data.user);
            fetchDashboardData(response.data.user.name);
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setFetchError('Failed to fetch user data. Please try again later.');
        })
        .finally(() => setLoading(false));
    } else {
      fetchDashboardData(user.name);
      setLoading(false);
    }
  }, [user, setUser]);

  const fetchDashboardData = (username) => {
    // Fetch notifications
    axios.get('http://localhost:3001/notifications', { withCredentials: true })
      .then(response => setNotifications(response.data))
      .catch(error => console.error('Error fetching notifications:', error));

    // Fetch accepted requests
    axios.get('http://localhost:3001/accepted-requests', {
      params: { donorName: username },
      withCredentials: true
    })
    .then(response => setAcceptedRequests(response.data))
    .catch(error => console.error('Error fetching accepted requests:', error));

    // Fetch user's blood requests directly based on username
    axios.get('http://localhost:3001/blood-requests', {
      params: { userName: username }, // Adjust the endpoint and params as per your backend
      withCredentials: true
    })
    .then(response => {
      // Filter the requests to only those made by the current user
      const filteredRequests = response.data.filter(request => request.userName === username);
      setUserRequests(filteredRequests); // Set filtered user requests directly
    })
    .catch(error => console.error('Error fetching user requests:', error));
  };

  const handleEmailContact = (email) => {
    window.location.href = `mailto:${email}`; // Open email client with pre-filled email address
  };

  const handleWhatsAppContact = (phoneNumber) => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank'); // Open WhatsApp chat
  };

  const getCardClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning';
      case 'accepted':
        return 'bg-success';
      case 'rejected':
        return 'bg-dark';
      default:
        return 'bg-secondary'; // Default class for undefined statuses
    }
  };

  return (
    <>
      <link
        href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        rel="stylesheet"
        id="bootstrap-css"
      />
      <div className="container-fluid mt-4 ml-3">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {fetchError && <div className="alert alert-danger">{fetchError}</div>}
            <h2 className="mb-4">Main Dashboard</h2>

            <div className="row">
              {/* Notification Summary Section */}
              <div className="col-md-3">
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
              <div className="col-md-4">
                <h4>Blood Requests You Accepted:</h4>
                <div className="col">
                  {acceptedRequests.length > 0 ? (
                    acceptedRequests.map((request, index) => (
                      <div key={index} className="card text-white bg-danger shadow rounded mb-3">
                        <div className="card-body">
                          <h5 className="card-title">Request</h5>
                          <p className="card-text">
                            <strong>From:</strong> {request.userName} <br />
                            <strong>Email:</strong> {request.userEmail} <br />
                            <strong>Phone Number:</strong> {request.userPhoneNo} <br />
                            <strong>Date:</strong> {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          <div className="d-flex justify-content-between">
                            <button className="btn btn-outline-light" onClick={() => handleEmailContact(request.donorEmail)}>
                              Contact via Email
                            </button>
                            <button className="btn btn-outline-light" onClick={() => handleWhatsAppContact(request.donorPhoneNo)}>
                              Contact via WhatsApp
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No accepted requests found.</p>
                  )}
                </div>
              </div>

              {/* Your Blood Requests Status Section */}
              <div className="col-md-3">
                <h4>Your Blood Requests Status:</h4>
                <div className="col">
                  {userRequests.length > 0 ? (
                    userRequests.map((request, index) => (
                      <div key={index} className={`card text-white ${getCardClass(request.status)} shadow rounded mb-3`}>
                        <div className="card-body">
                          <h5 className="card-title">Your Request</h5>
                          <p className="card-text">
                            <strong>To Donor:</strong> {request.donorName} <br />
                            <strong>Email:</strong> {request.donorEmail} <br />
                            <strong>Phone Number:</strong> {request.donorPhoneNo} <br />
                            <strong>Status:</strong> {request.status} <br />
                            <strong>Date:</strong> {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No requests found.</p>
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
