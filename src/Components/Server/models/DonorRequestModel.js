const mongoose = require("mongoose");

const DonorRequestSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Donor" // Assuming you have a Donor model
    },
    donorName: {
        type: String,
        required: true
    },
    donorEmail: {
        type: String,
        required: true
    },
    donorPhoneNo: {
        type: String,
        required: true
    },
    donorBloodGroup: {
        type: String,
        required: true
    },
    donorLocation: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userPhoneNo: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const DonorRequestModel = mongoose.model("DonorRequest", DonorRequestSchema);
module.exports = DonorRequestModel;
