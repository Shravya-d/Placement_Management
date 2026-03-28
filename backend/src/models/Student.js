const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const applicationSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['APPLIED', 'SELECTED', 'REJECTED'],
        default: 'APPLIED'
    }
});

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false
    },
    usn: {
        type: String,
        required: [true, 'Please provide a USN'],
        unique: true,
        uppercase: true
    },
    phone: String,
    branch: String,
    cgpa: {
        type: Number,
        default: 0
    },
    skills: [{
        type: String,
        required: true
    }],
    backlogs: {
        type: Boolean,
        default: false
    },
    resume: String,
    placementStatus: {
        type: String,
        enum: ['NOT_PLACED', 'PLACED'],
        default: 'NOT_PLACED'
    },
    applications: [applicationSchema],
    eligibleCompanies: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    role: {
        type: String,
        default: 'student'
    }
}, { timestamps: true });

// Pre-save middleware to hash password
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method to verify password
studentSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
