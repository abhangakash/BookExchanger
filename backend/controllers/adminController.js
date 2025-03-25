const Admin = require('../models/Admin');
const Buyer = require('../models/Buyer');
const Seller = require('../models/Seller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Book = require('../models/Book'); // ✅ singular
const Order = require('../models/Order');


// Admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token, message: 'Admin login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Fetch admin profile
const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Change admin password
const updateAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Current password is incorrect' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Manage users (buyers and sellers)
const getAllUsers = async (req, res) => {
    try {
        const buyers = await Buyer.find().select('-password'); // Exclude passwords
        const sellers = await Seller.find().select('-password'); // Exclude passwords
        res.json({ buyers, sellers });
    } catch (error) {
        console.error("Error fetching users:", error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error });
    }
};

// Fetch buyers
const getAllBuyers = async (req, res) => {
    try {
        const buyers = await Buyer.find().select("name email branch status"); // ✅ include status
        res.status(200).json(buyers);
    } catch (error) {
        res.status(500).json({ message: "Failed to get buyers" });
    }
};


// Fetch sellers
const getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find().select('-password'); // Exclude passwords
        res.json(sellers);
    } catch (error) {
        console.error("Error fetching sellers:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('seller', 'name email');
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch books', error });
    }
};

// Delete a book
const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        await Book.findByIdAndDelete(bookId);
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete book', error });
    }
};

//order management
// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('buyer', 'name email')
            .populate('seller', 'name email')
            .populate('book', 'title price');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error });
    }
};

//Analytics/Reports
// Get counts for dashboard
const getDashboardStats = async (req, res) => {
    try {
        // Optional: log user ID to verify token worked
        console.log("Admin ID from token:", req.user?.id);

        const buyerCount = await Buyer.countDocuments();
        const sellerCount = await Seller.countDocuments();
        const bookCount = await Book.countDocuments();
        const orderCount = await Order.countDocuments();

        res.json({ buyerCount, sellerCount, bookCount, orderCount });
    } catch (error) {
        console.error("Error in getDashboardStats:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const toggleBuyerStatus = async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.params.id);
        if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

        buyer.status = buyer.status === 'blocked' ? 'active' : 'blocked';
        await buyer.save();
        res.status(200).json({ message: `Buyer ${buyer.status}` });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling status', error });
    }
};

const toggleSellerStatus = async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id);
        if (!seller) return res.status(404).json({ message: 'Seller not found' });

        seller.status = seller.status === 'blocked' ? 'active' : 'blocked';
        await seller.save();
        res.status(200).json({ message: `Seller ${seller.status}` });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling status', error });
    }
};


module.exports = { getAllBuyers, getAllSellers, getAllUsers, adminLogin, getAdminProfile, updateAdminPassword , getAllBooks, deleteBook, getAllOrders, toggleSellerStatus, toggleBuyerStatus, getDashboardStats };

