const Buyer = require('../models/Buyer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Buyer signup
const buyerSignup = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        const existingBuyer = await Buyer.findOne({ email });
        if (existingBuyer) return res.status(400).json({ message: 'Buyer already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const buyer = new Buyer({ name, email, password: hashedPassword, address });
        await buyer.save();

        const token = jwt.sign({ id: buyer._id, role: 'buyer' }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token, message: 'Buyer created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Buyer login
const buyerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const buyer = await Buyer.findOne({ email });
        if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

        // ⛔️ Check if buyer is blocked
        if (buyer.status === 'blocked') {
            return res.status(403).json({ message: 'Your account is blocked. Please contact support.' });
        }

        const isPasswordValid = await bcrypt.compare(password, buyer.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: buyer._id, role: 'buyer' }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            token,
            userId: buyer._id,
            role: "buyer",
            name: buyer.name,
            message: "Login successful",
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



// ✅ Fetch Buyer Profile
const getBuyerProfile = async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.user.id).select("-password"); // Exclude password
        if (!buyer) {
            return res.status(404).json({ message: "Buyer not found" });
        }
        res.status(200).json(buyer);
    } catch (error) {
        console.error("Error fetching buyer profile:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Update Buyer Profile
const updateBuyerProfile = async (req, res) => {
    try {
        const { name, email, address } = req.body;

        let buyer = await Buyer.findById(req.user.id);
        if (!buyer) {
            return res.status(404).json({ message: "Buyer not found" });
        }

        // Update only provided fields
        if (name) buyer.name = name;
        if (email) buyer.email = email;
        if (address) buyer.address = address;

        await buyer.save();

        res.status(200).json({ message: "Profile updated successfully", buyer });
    } catch (error) {
        console.error("Error updating buyer profile:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const changeBuyerPassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        const buyer = await Buyer.findById(req.user.id);
        if (!buyer) return res.status(404).json({ message: "Buyer not found" });

        const isMatch = await bcrypt.compare(password, buyer.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

        const salt = await bcrypt.genSalt(10);
        buyer.password = await bcrypt.hash(newPassword, salt);
        await buyer.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { buyerSignup, buyerLogin, getBuyerProfile, updateBuyerProfile, changeBuyerPassword };
