const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const { rentBook, getBuyerRentals, getSellerRentals } = require('../controllers/rentalController');

const router = express.Router();

// Rent a book (buyer)
router.post('/rent-book', verifyToken, rentBook);

// View all rentals by the buyer
router.get('/buyer-rentals', verifyToken, getBuyerRentals);

// View all rentals for the seller
router.get('/seller-rentals', verifyToken, getSellerRentals);

module.exports = router;
