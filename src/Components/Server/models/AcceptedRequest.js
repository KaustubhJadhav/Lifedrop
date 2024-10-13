// models/AcceptedRequest.js
const mongoose = require('mongoose');

const acceptedRequestSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
  },
  donorEmail: {
    type: String,
    required: true,
  },
  donorPhoneNo: {
    type: String,
    required: true,
  },
  donorLocation: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPhoneNo: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AcceptedRequest = mongoose.model('AcceptedRequest', acceptedRequestSchema);

module.exports = AcceptedRequest;
