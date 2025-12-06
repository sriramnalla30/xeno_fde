const express = require('express');
const router = express.Router();
const { getTenant } = require('../middleware/authMiddleware');
const { getDashboardStats, getRecentOrders, getTopCustomers, getOrdersByDate, getOrdersByTime, getProducts } = require('../controllers/dashboardController');

router.get('/stats', getTenant, getDashboardStats);
router.get('/orders', getTenant, getRecentOrders);
router.get('/orders-by-date', getTenant, getOrdersByDate);
router.get('/orders-by-time', getTenant, getOrdersByTime);
router.get('/top-customers', getTenant, getTopCustomers);
router.get('/products', getTenant, getProducts);

module.exports = router;
