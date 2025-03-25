const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
    getBooksBySeller,
    addBook,
    updateBook,
    deleteBook,
    getAllBooks,
    getBookById,
    getSimilarBooks,
    getBranches
} = require("../controllers/bookController");

const router = express.Router();

// ✅ Correct backend route (Matches frontend call)
router.get("/seller/books", verifyToken, getBooksBySeller);
router.post("/seller/books",verifyToken, upload.array("images", 5), addBook);
router.put("/seller/books/:id", verifyToken, upload.array("images", 5), updateBook);
router.delete("/seller/books/:id", verifyToken, deleteBook);
router.get("/buyer/books", getAllBooks);
router.get("/branches", getBranches); // ✅ This should come first
router.get("/:id", getBookById);
router.get("/similar/:id", getSimilarBooks);



module.exports = router;
