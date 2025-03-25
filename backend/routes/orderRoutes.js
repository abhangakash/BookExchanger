const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { createOrder, getOrdersBySeller, getOrdersByBuyer, updateOrderStatus } = require("../controllers/orderController");

// POST: Create order
router.post("/create", createOrder);

// GET: Get orders by seller
router.get("/seller/:sellerId",verifyToken , getOrdersBySeller);

// GET: Get orders by buyer
router.get("/buyer/:buyerId",verifyToken , getOrdersByBuyer);

// ✅ Update order status (Pending, Shipped, Delivered, Cancelled)
router.put("/update/:orderId",verifyToken , updateOrderStatus);

module.exports = router;
