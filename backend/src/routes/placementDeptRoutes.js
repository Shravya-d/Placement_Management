const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const placementDeptController = require('../controllers/placementDeptController');

const router = express.Router();

// Placement department is an admin role
router.use(auth.protect);
router.use(role.restrictTo('admin'));

router.post('/companies', placementDeptController.addCompany);
router.get('/companies/applicants', placementDeptController.getCompanyApplicants);
router.post('/companies/:companyId/select', placementDeptController.selectStudents);

router.post('/companies/:companyId/reject', placementDeptController.rejectStudents);

router.get('/company-history', placementDeptController.getCompanyHistory);
router.patch('/profile', placementDeptController.updateProfile);

module.exports = router;
