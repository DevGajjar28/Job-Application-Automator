const mongoose = require('mongoose');

const AppliedApplicationSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    dateApplied: { type: Date, default: Date.now },
    userEmail: { type: String, required: true }
});

const Applied = mongoose.model('Applied', AppliedApplicationSchema);

module.exports = Applied;
