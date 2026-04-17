const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

// Courses are public/accessible to students exploring eligibility
router.get('/', courseController.getCourses);

module.exports = router;
