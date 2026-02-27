const express = require('express');
const {
  getDashboardSummary,
  getExpenseByCategory,
  getMonthlyComparison,
  getSpendingTrend,
} = require('../controllers/analyticsController');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/summary', getDashboardSummary);
router.get('/expense-by-category', getExpenseByCategory);
router.get('/monthly-comparison', getMonthlyComparison);
router.get('/spending-trend', getSpendingTrend);

module.exports = router;
