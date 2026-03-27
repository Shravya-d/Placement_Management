const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.registerStudent);
router.post('/register-admin', authController.registerAdmin);
router.post('/login', authController.login);

module.exports = router;
