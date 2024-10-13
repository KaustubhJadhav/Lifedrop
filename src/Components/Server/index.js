const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const DonorModel = require('./models/Donor');
const DonorRequestModel = require('./models/DonorRequestModel'); // Import DonorRequest model
const UserModel = require('./models/Users'); // Ensure you have UserModel imported for registration
const AcceptedRequest = require('./models/AcceptedRequest'); // Import the model
const NotificationModel = require('./models/Notification');
const bcrypt = require('bcrypt');
// Import the accepted request model
const Request = require('./models/Request'); // Import the original donor request model

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true
}));

app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/UserDB"
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: false // Set to `true` in production with HTTPS
  }
}));


// MongoDB connection
mongoose.connect("mongodb://localhost:27017/UserDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.post('/send-notification', async (req, res) => {
  const { userId, type, message } = req.body;

  try {
    const notification = new NotificationModel({ userId, type, message });
    await notification.save();
    res.status(201).json({ message: "Notification sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch Notifications
app.get('/notifications', async (req, res) => {
  if (req.session.user) {
    try {
      const userId = req.session.user.id;
      const notifications = await NotificationModel.find({ userId });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
  } else {
    res.status(401).json("Not authenticated");
  }
});

// Mark Notification as Read
app.patch('/notifications/:notificationId', async (req, res) => {
  const { notificationId } = req.params;
  const { read } = req.body;

  try {
    const notification = await NotificationModel.findByIdAndUpdate(notificationId, { read }, { new: true });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register route
app.post('/register', async (req, res) => {
  const { name, email, bloodgroup, password, phoneNo, location } = req.body;

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const user = new UserModel({
      name,
      email,
      bloodgroup,
      password: hashedPassword,
      phoneNo,
      location
    });
    await user.save();

    // Save donor
    const donor = await DonorModel.create(req.body);
    res.json({ message: "User and Donor created successfully", donor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "USER NOT FOUND" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect Password" });
    }

    // Generate JWT token if needed
    const token = jwt.sign({ name: user.email }, process.env.KEY, { expiresIn: '3h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 720000, secure: false });

    // Store the session details
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNo: user.phoneNo,
      bloodGroup: user.bloodgroup,
      location: user.location,
      isLoggedin: true // Set the logged in state here in the session
    };

    res.json("SUCCESS");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Get all donors
app.get('/donors', (req, res) => {
  DonorModel.find({})
    .then(donors => res.json(donors))
    .catch(err => res.status(500).json({ error: "Unable to fetch donors" }));
});

// Get current user session
app.get('/user', (req, res) => {
  console.log(req.session); // Add this log to inspect session data
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json("NOT AUTHENTICATED");
  }
});


// Find donors by blood group or location
app.post('/find-donors', (req, res) => {
  const { bloodgroup, location } = req.body;

  let query = {};
  if (bloodgroup) {
    query.bloodgroup = bloodgroup;
  } else if (location) {
    query.location = location;
  }

  DonorModel.find(query)
    .then(donors => res.json(donors))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Request blood route
app.post('/request-blood', async (req, res) => {
  // console.log(req.body + " From Requests Page");

  // Check if user is authenticated
  if (!req.session.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const { donorId, donorData, userData } = req.body; // Extract donor and user data from the request body

  try {
    // Fetch the donor by donorId
    const donor = await DonorModel.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    // Create a new blood request
    const newRequest = new DonorRequestModel({
      donorId, // Reference to the donor
      donorName: donorData.name, // Donor's name
      donorEmail: donorData.email, // Donor's email
      donorPhoneNo: donorData.phoneNo, // Donor's phone number
      donorBloodGroup: donorData.bloodGroup, // Donor's blood group
      donorLocation: donorData.location, // Donor's location
      userName: userData.name, // User's name
      userEmail: userData.email, // User's email
      userPhoneNo: userData.phoneNo // User's phone number
    });

    // Save the request to the database
    await newRequest.save();
    res.status(201).json({ message: "Request Submitted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting request", error: error.message });
  }
});

// DELETE blood request by ID
// const mongoose = require('mongoose');

// Delete route


// Corrected Delete route
app.delete('/request/:id', async (req, res) => {
  try {
    const requestId = req.params.id;

    // Convert requestId to ObjectId
    const objectId = new mongoose.Types.ObjectId(requestId);
    console.log("object id: " + objectId);
    console.log("Request ID received: ", req.params.id);

    // Delete from the Request collection, not AcceptedRequest
    const deletedRequest = await Request.findByIdAndDelete(objectId);

    if (!deletedRequest) {
      console.log('Request not found.');
      return res.status(404).send({ message: 'Request not found.' });
    }

    console.log('Request deleted successfully.');
    res.status(200).send({ message: 'Request deleted successfully.' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});




// POST accept request (move to acceptedRequests collection)


app.post('/accept-request/:id', async (req, res) => {
  try {
    const requestId = req.params.id;
    console.log("Check: " + requestId);
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).send({ message: 'Request not found.' });
    }

    const acceptedRequest = new AcceptedRequest({
      donorName: request.donorName,
      donorEmail: request.donorEmail,
      donorPhoneNo: request.donorPhoneNo,
      donorLocation: request.donorLocation,
      userName: request.userName, // Assuming the request has userName
      userEmail: request.userEmail, // Assuming the request has userName
      userPhoneNo: request.userPhoneNo, // Assuming the request has userPhoneNo
      createdAt: request.createdAt,
      acceptedAt: Date.now(),
    });

    // Save the accepted request to the database
    await acceptedRequest.save();

    // Delete the original request from donorrequests collection
    await Request.findByIdAndDelete(requestId);

    // Send a success response
    res.status(200).send({ message: 'Request accepted successfully.' });
  } catch (error) {
    console.error('Error accepting request:', error); // Enhanced logging
    res.status(500).send({ message: 'Error accepting request.', error: error.message }); // Send error message
  }
});





app.get('/accepted-requests', async (req, res) => {
  try {
    const donorName = req.query.donorName; // Extract donorName from query params

    if (!donorName) {
      return res.status(400).send({ message: 'Donor name is required' });
    }

    // Fetch only accepted requests for the logged-in donor
    const acceptedRequests = await AcceptedRequest.find({ donorName });
    
    if (acceptedRequests.length === 0) {
      return res.status(404).send({ message: 'No accepted requests found for this donor.' });
    }

    res.json(acceptedRequests); // Send the filtered accepted requests
  } catch (error) {
    console.error('Error fetching accepted requests:', error);
    res.status(500).send({ message: 'Error fetching accepted requests' });
  }
});





// In your Express backend
app.get('/user-requests', async (req, res) => {
  // console.log('Session User:', req.session.user); // Log session user info
  if (!req.session.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const requests = await DonorRequestModel.find({ donorEmail: req.session.user.email });
    // console.log('Requests:', requests); // Log the fetched requests
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error: error.message });
  }
});





// Logout route
app.post('/logout', (req, res) => {
  if (req.session) {
    // Set isLoggedin to false before destroying the session
    req.session.isLoggedin = false; // Optionally log this state
    req.session.destroy(err => {
      if (err) {
        console.log("Failed to Logout: " + err);
        res.status(500).json({ error: "Failed To Logout" });
      } else {
        console.log("Logout Success!");
        res.status(200).json("Logout Successful");
      }
    });
  } else {
    console.log("No Session Found");
    res.status(400).json({ error: "No Session Found" });
  }
});




// Start server
app.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});