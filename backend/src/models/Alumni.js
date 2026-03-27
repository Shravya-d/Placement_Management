const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const alumniSchema = new mongoose.Schema({
    studentData: {
        name: String,
        email: String,
        usn: String,
        phone: String,
        branch: String,
        cgpa: Number,
        skills: [String],
        resume: String
    },
    password: {
        type: String,
        select: false 
        // Need to let alumni log in to give feedback!
    },
    companyJoined: String,
    role: String,
    placedDate: Date,
    appRole: {
        type: String,
        default: 'alumni'
    }
}, { timestamps: true });

// Since Alumni login is separate but uses exact credentials from student, 
// we migrate the password from student when placed.
alumniSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const Alumni = mongoose.model('Alumni', alumniSchema, 'alumni');

module.exports = Alumni;
