// routes/analytics.js
const express = require('express');
const router = express.Router();
const { getAnalyticsData } = require('../controllers/analyticsController');

// Route to get analytics data
router.get('/', getAnalyticsData);

module.exports = router;
