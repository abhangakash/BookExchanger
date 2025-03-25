const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
    sellerSignup,
    sellerLogin,
    getSellerProfile,
    updateSellerProfile,
    changeSellerPassword,
    deleteSellerAccount
} = require("../controllers/sellerController");

const router = express.Router();

// ✅ Seller Signup & Login
router.post("/signup", sellerSignup);
router.post("/login", sellerLogin);

// ✅ Profile Management (Protected Routes)
router.get("/profile", verifyToken, getSellerProfile);
router.put("/profile", verifyToken, updateSellerProfile);
router.put("/change-password", verifyToken, changeSellerPassword);
router.delete("/delete-account", verifyToken, deleteSellerAccount);

module.exports = router;
