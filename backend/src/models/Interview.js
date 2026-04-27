const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ['online', 'offline'],
        required: true
    },
    meetingLink: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'selected', 'rejected'],
        default: 'scheduled'
    }
}, { timestamps: true });

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
