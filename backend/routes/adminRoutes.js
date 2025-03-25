const express = require('express');
const { adminLogin, getAdminProfile, updateAdminPassword, getAllUsers,  getAllBuyers, getAllSellers, getAllBooks, deleteBook, 
    getAllOrders, 
    getDashboardStats, toggleSellerStatus, toggleBuyerStatus } = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Admin login route
router.post('/login', adminLogin);

// Protected routes for admin actions
router.get('/profile', verifyToken, getAdminProfile);
router.put('/password', verifyToken, updateAdminPassword);
router.get('/users', verifyToken, getAllUsers);
router.get('/buyers', verifyToken, getAllBuyers);
router.get('/sellers', verifyToken, getAllSellers);
// Book Management
router.get('/books', verifyToken, getAllBooks);
router.delete('/books/:bookId', verifyToken, deleteBook);

// Order Management
router.get('/orders', verifyToken, getAllOrders);

// Dashboard Stats
router.get('/stats', verifyToken, getDashboardStats);


router.put('/buyers/:id/toggle-status', verifyToken, toggleBuyerStatus);
router.put('/sellers/:id/toggle-status', verifyToken, toggleSellerStatus);

module.exports = router;
