const express = require('express');
const interviewController = require('../controllers/interviewController');
const authController = require('../controllers/authController');

const router = express.Router();

// Only logged in users can access interview routes
router.use(authController.protect);

router.get('/student/:id', interviewController.getStudentInterviews);

// Only admins can assign or update interviews
router.use(authController.restrictTo('admin'));

router.post('/assign', interviewController.assignInterview);
router.put('/status', interviewController.updateInterviewStatus);

module.exports = router;
