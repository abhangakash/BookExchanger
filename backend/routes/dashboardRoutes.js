const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
    getSellerDashboardStats,
    getRecentOrders,
    getSalesChartData,
} = require("../controllers/dashboardController");

const router = express.Router();

// ✅ Get seller dashboard stats
router.get("/seller/stats", verifyToken, getSellerDashboardStats);

// ✅ Get recent orders
router.get("/seller/recent-orders", verifyToken, getRecentOrders);

// ✅ Get sales chart data
router.get("/seller/sales-chart", verifyToken, getSalesChartData);

module.exports = router;
