const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const studentController = require('../controllers/studentController');

const router = express.Router();

// All routes after this will require login and student role
router.use(auth.protect);
router.use(role.restrictTo('student'));

router.patch('/profile', studentController.updateProfile);
router.get('/eligible-companies', studentController.getEligibleCompanies);

router.post('/apply/:companyId', studentController.applyToCompany);
router.get('/company-feedbacks/:companyId', studentController.viewCompanyFeedbacks);
router.get('/eligibility/:companyId', studentController.getCompanyEligibility);

module.exports = router;
