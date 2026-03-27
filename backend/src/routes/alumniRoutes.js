const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const alumniController = require('../controllers/alumniController');

const router = express.Router();

// Protect endpoints, restrict to alumni
router.use(auth.protect);
router.use(role.restrictTo('alumni'));

router.post('/feedback', alumniController.addFeedback);
router.get('/network', alumniController.viewAlumniContactDetails);

module.exports = router;
