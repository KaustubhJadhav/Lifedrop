const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema({
    name: String,
    bloodgroup: String,
    email: String,
    phoneNo: String,
    location: String
});

const DonorModel = mongoose.model('Donor', DonorSchema);

module.exports = DonorModel;
