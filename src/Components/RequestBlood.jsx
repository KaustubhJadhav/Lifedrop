import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const RequestBlood = () => {
  const [requests, setRequests] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user', { withCredentials: true });
        if (response.data.user) {
          setUser(response.data.user);
          fetchUserRequests(response.data.user.name); // Fetch requests by userName
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    const fetchUserRequests = async (userName) => {
      try {
        const response = await axios.get('http://localhost:3001/user-requests', {
          params: { userName }, // Sending userName instead of userEmail
          withCredentials: true,
        });
        setRequests(response.data);
      } catch (error) {
        console.log('Error fetching requests:', error);
      }
    };

    if (!user) {
      fetchUserData();
    } else {
      fetchUserRequests(user.name); // Use user.name to fetch requests
    }
  }, [user, setUser]);

  const handleDeleteRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:3001/request/${requestToDelete}`, { withCredentials: true });
      if (response.status === 200) {
        setRequests(prevRequests => prevRequests.filter(request => request._id !== requestToDelete));
        setShowModal(false);
      }
    } catch (error) {
      console.log('Error deleting request:', error);
    } finally {
      setLoading(false);
      setRequestToDelete(null);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:3001/accept-request/${requestId}`, {}, { withCredentials: true });
      if (response.status === 200) {
        // Update the request status in the state
        setRequests(prevRequests => 
          prevRequests.map(request => 
            request._id === requestId ? { ...request, status: 'accepted' } : request
          ).filter(request => request.status === 'pending') // Filter out accepted/rejected requests
        );
      }
    } catch (error) {
      console.error('Error accepting request:', error.message);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        rel="stylesheet"
        id="bootstrap-css"
      />
      <style>
        {`
          .card {
            transition: transform 0.3s;
          }
          .card:hover {
            transform: scale(1.05);
          }
          .text-shadow {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          }
          .btn-container {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top-color: #007bff;
            animation: spin 1.5s infinite linear;
            margin: auto;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      {/* Modal for confirming deletion */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Confirm Deletion</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this request?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteRequest}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ marginTop: '40px' }}>
        <h1 className="display-4 text-center mb-4 text-shadow">Your Blood Requests</h1>
        {loading ? (
          <div className="loading-spinner"></div> // Display loading spinner during the loading state
        ) : requests.filter(request => request.status === 'pending').length > 0 ? ( // Filter to show only pending requests
          <div className="row">
            {requests.filter(request => request.status === 'pending').map((request) => ( // Only show pending requests
              <div key={request._id} className="col-md-4 mb-4">
                <div className="card shadow rounded" style={{ width: "20rem" }}>
                  <div className="d-flex justify-content-center align-items-center" style={{ height: '150px', overflow: 'hidden' }}>
                    <img className="card-img-top" src={require("./blood-drop.png")} alt="" style={{ maxHeight: '80%', maxWidth: '50%' }} />
                  </div>
                  <div className="card-body" style={{ color: 'black' }}>
                    <h5 className="card-title">New Request!</h5>
                    <strong className="card-subtitle mb-2">Name: </strong>{request.userName}
                    <p className="card-text">
                      <strong>Email:</strong> {request.userEmail} <br />
                      <strong>Phone Number:</strong> {request.userPhoneNo} <br />
                      <strong>Request Date:</strong> {new Date(request.createdAt).toLocaleDateString()}<br />
                      <strong>Status:</strong> {request.status} {/* Display the request status */}
                    </p>
                    <div className="btn-container">
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setRequestToDelete(request._id);
                          setShowModal(true); // Show modal on delete click
                        }}
                      >
                        Delete
                      </button>
                      <button 
                        className="btn btn-success" 
                        onClick={() => handleAcceptRequest(request._id)}
                        disabled={request.status === 'accepted'} // Disable if already accepted
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))} 
          </div>
        ) : (
          <p className="text-center">No requests found.</p>
        )}
      </div>
    </>
  );
};

export default RequestBlood;
