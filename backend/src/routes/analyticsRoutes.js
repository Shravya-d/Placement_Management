const express = require('express');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// Making all analytics endpoints public as per requirement
router.get('/placement-rate', analyticsController.getPlacementRate);
router.get('/departments', analyticsController.getDepartmentsStats);
router.get('/company-stats', analyticsController.getCompanyStats);
router.get('/funnel', analyticsController.getFunnelStats);
router.get('/top-skills', analyticsController.getTopSkillsInDemand);

module.exports = router;
