const express = require("express");
const { getSalesReport, getBestSellingBooks,getOrderSummary } = require("../controllers/reportController");
const { verifyToken } = require("../middlewares/authMiddleware"); // ✅ Ensure correct path

const router = express.Router();

// 🟢 Requires authentication (verifyToken)
router.get("/sales", verifyToken, getSalesReport);
router.get("/best-sellers", verifyToken, getBestSellingBooks);
router.get("/orders-summary", verifyToken, getOrderSummary); // ✅ New API

module.exports = router;
