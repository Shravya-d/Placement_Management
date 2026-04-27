const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const applicantSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    matchedSkillsCount: Number,
    resume: String,
    status: {
        type: String,
        enum: ['APPLIED', 'INTERVIEW_SCHEDULED', 'COMPLETED', 'SELECTED', 'REJECTED'],
        default: 'APPLIED'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

const feedbackSchema = new mongoose.Schema({
    alumniId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumni',
        required: true
    },
    message: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    role: String,
    jdSkills: [String],
    cgpaCriteria: {
        type: Number,
        required: false
    },
    backlog: {
        type: Boolean,
        required: false
    },
    branchesAllowed: [String],
    numberOfCandidates: {
        type: Number,
        required: false
    },
    visitDate: Date,
    applicationDeadline: {
        type: Date,
        required: function() { return this.isNew; }
    },
    alertTriggered: {
        type: Boolean,
        default: false
    },
    description: String,
    anonymousMode: {
        type: Boolean,
        default: false
    },
    applicants: [applicantSchema],
    selectedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    feedbacks: [feedbackSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const placementDeptSchema = new mongoose.Schema({
    adminDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: String,
        password: { type: String, required: true, select: false },
        role: { type: String, default: 'admin' }
    },
    companies: [companySchema]
}, { timestamps: true });

// Hash admin password before saving
placementDeptSchema.pre('save', async function(next) {
    if (!this.isModified('adminDetails.password')) return next();
    this.adminDetails.password = await bcrypt.hash(this.adminDetails.password, 12);
    next();
});

// Verify credentials
placementDeptSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const PlacementDept = mongoose.model('PlacementDept', placementDeptSchema, 'placementDept');

module.exports = PlacementDept;
