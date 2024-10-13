import React, { useState } from 'react';
import axios from 'axios';

const FindDonors = () => {
  const [searchBy, setSearchBy] = useState('bloodgroup');
  const [bloodgroup, setbloodgroup] = useState('');
  const [location, setLocation] = useState('');
  const [donors, setDonors] = useState([]);
  const [showModal, setShowModal] = useState(false); // State for modal
  const [modalMessage, setModalMessage] = useState(''); // Message in modal

  const handleSearch = (e) => {
    e.preventDefault();
    const searchData = searchBy === 'bloodgroup' ? { bloodgroup: bloodgroup } : { location };

    axios.post('http://localhost:3001/find-donors', searchData, { withCredentials: true })
      .then(response => {
        setDonors(response.data);
      })
      .catch(error => console.log(error));
  };

  const handleRequestBlood = (donor) => {
    // Fetch user data from the server
    axios.get('http://localhost:3001/user', { withCredentials: true })
      .then(userResponse => {
        const userData = userResponse.data.user; // Assuming the user data is in this structure

        const requestBody = {
          donorId: donor._id,
          donorData: {
            name: donor.name,
            email: donor.email,
            phoneNo: donor.phoneNo,
            bloodGroup: donor.bloodgroup,
            location: donor.location,
          },
          userData: {
            name: userData.name,
            email: userData.email,
            phoneNo: userData.phoneNo,
          }
        };

        console.log(requestBody);

        return axios.post('http://localhost:3001/request-blood', requestBody, { withCredentials: true });
      })
      .then(response => {
        setModalMessage('Request Sent Successfully!');
        setShowModal(true);
      })
      .catch(error => {
        setModalMessage('Failed to send request.');
        setShowModal(true);
      });
  };



  const closeModal = () => {
    setShowModal(false); // Close modal
  };

  return (<>
    <link
      href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      rel="stylesheet"
      id="bootstrap-css"
    />
    <div className="container" style={{ marginTop: '40px', marginLeft: '50px' }}>
      <h2>Find Donors</h2>
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="searchBy">Search by:</label><br />
          <select
            id="searchBy"
            className="form-control"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            style={{ maxWidth: 300 }}
          >
            <option value="bloodgroup">Blood Group</option>
            <option value="location">Location</option>
          </select>
        </div>

        {searchBy === 'bloodgroup' && (
          <div className="form-group">
            <label htmlFor="bloodgroup">Blood Group:</label>
            <select
              id="bloodgroup"
              className="form-control"
              value={bloodgroup}
              style={{ maxWidth: 300 }}
              onChange={(e) => setbloodgroup(e.target.value)}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        )}

        {searchBy === 'location' && (
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter Location to Search"
              style={{ width: '300px', marginBottom: '10px' }}
            />
          </div>
        )}

        <button type="submit" className="btn btn-danger">Search Donors</button>
      </form>

      <div className="row mt-4">
        <h3>Available Donors:</h3>
        {donors.length > 0 ? (
          donors.map((donor) => (
            <div className="col-md-4 mb-3" key={donor._id}>
              <div className="card">
                <div className="card-body" style={{ color: 'black' }}>
                  <h5 className="card-title">{donor.name}</h5>
                  <h6 className="card-subtitle mb-2">Blood Group: {donor.bloodgroup}</h6>
                  <p className="card-text" style={{ color: 'black' }}>Location: {donor.location}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleRequestBlood(donor)}
                  >
                    Request Blood
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No donors found.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Notification</h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {modalMessage}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div></>
  );
};

export default FindDonors;
