const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    platform: String,
    url: String,
    duration: String
});

const skillCourseSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    courses: [courseSchema]
}, { timestamps: true });

const SkillCourse = mongoose.model('SkillCourse', skillCourseSchema, 'skillCourses');

module.exports = SkillCourse;
