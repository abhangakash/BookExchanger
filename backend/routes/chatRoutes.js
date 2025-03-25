const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { startChatWithSeller, sendMessage, getChat, getAllChats ,getUnreadMessages, markChatAsRead   } = require("../controllers/chatController"); // ✅ Correct import

// ✅ Start a chat (Buyer only)
router.post("/start", verifyToken, startChatWithSeller);

// ✅ Send message (Both Buyer & Seller)
router.post("/send", verifyToken, (req, res, next) => {
    console.log("📩 Chat send API hit! Request body:", req.body);
    next();
}, sendMessage);
router.put("/:chatId/read", verifyToken, markChatAsRead); // ✅ New route to mark as read
router.get("/unread", verifyToken, getUnreadMessages); // ✅ Add this


// ✅ Get chat messages (Both Buyer & Seller)
router.get("/:chatId", verifyToken, getChat);

// ✅ Get all chats for a user (Both Buyer & Seller)
router.get("/", verifyToken, getAllChats);

// ✅ Get unread message count for a buyer
// In routes/chatRoutes.js




module.exports = router;
