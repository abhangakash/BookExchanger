const express = require('express');
const { buyerSignup, buyerLogin, getBuyerProfile, updateBuyerProfile, changeBuyerPassword} = require('../controllers/buyerController');
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/signup', buyerSignup); // Buyer signup
router.post('/login', buyerLogin);   // Buyer login
// ✅ Get Buyer Profile
router.get("/profile", verifyToken, getBuyerProfile);

// ✅ Update Buyer Profile
router.put("/profile", verifyToken, updateBuyerProfile);
router.put("/change-password", verifyToken, changeBuyerPassword);



module.exports = router;
