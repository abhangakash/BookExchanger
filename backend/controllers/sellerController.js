const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Seller Signup
const sellerSignup = async (req, res) => {
    try {
        const { name, email, password, sellerType, shopName, shopAddress } = req.body;

        if (!["shop owner", "student"].includes(sellerType)) {
            return res.status(400).json({ message: 'Invalid seller type. Must be "shop owner" or "student".' });
        }

        if (sellerType === "shop owner" && (!shopName || !shopAddress)) {
            return res.status(400).json({ message: "Shop name and address are required for shop owners." });
        }

        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) return res.status(400).json({ message: "Seller already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const sellerData = { name, email, password: hashedPassword, sellerType };
        if (sellerType === "shop owner") {
            sellerData.shopName = shopName;
            sellerData.shopAddress = shopAddress;
        }

        const seller = new Seller(sellerData);
        await seller.save();

        const token = jwt.sign({ id: seller._id, role: "seller" }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({ token, message: "Seller created successfully", sellerType });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Seller Login
const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const seller = await Seller.findOne({ email });
        if (!seller) return res.status(404).json({ message: "Seller not found" });

        // ✅ Blocked seller check
        if (seller.status === "blocked") {
            return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
        }

        const isPasswordValid = await bcrypt.compare(password, seller.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: seller._id, role: "seller" }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            token,
            userId: seller._id,
            role: "seller",
            name: seller.name,
            message: "Login successful",
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};



// ✅ Fetch Seller Profile
const getSellerProfile = async (req, res) => {
    try {
        const seller = await Seller.findById(req.user.id).select("-password"); // Exclude password
        if (!seller) return res.status(404).json({ message: "Seller not found" });

        res.status(200).json(seller);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Update Seller Profile
const updateSellerProfile = async (req, res) => {
    try {
        const seller = await Seller.findById(req.user.id);
        if (!seller) return res.status(404).json({ message: "Seller not found" });

        const { name, phone, shopName, shopAddress, sellerType } = req.body;

        // ✅ Prevent overwriting required fields with empty values
        if (name) seller.name = name;
        if (phone) seller.phone = phone;
        if (sellerType && ["shop owner", "student"].includes(sellerType)) {
            seller.sellerType = sellerType;
        }

        // ✅ Only update `shopName` and `shopAddress` for `shop owners`
        if (sellerType === "shop owner") {
            seller.shopName = shopName || seller.shopName;
            seller.shopAddress = shopAddress || seller.shopAddress;
        } else {
            seller.shopName = undefined; // Clear shop fields for non-shop owners
            seller.shopAddress = undefined;
        }

        await seller.save();
        res.status(200).json({ message: "Profile updated successfully", seller });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// ✅ Change Seller Password
const changeSellerPassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        const seller = await Seller.findById(req.user.id);
        if (!seller) return res.status(404).json({ message: "Seller not found" });

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

        const salt = await bcrypt.genSalt(10);
        seller.password = await bcrypt.hash(newPassword, salt);
        await seller.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Delete Seller Account
const deleteSellerAccount = async (req, res) => {
    try {
        await Seller.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    sellerSignup,
    sellerLogin,
    getSellerProfile,
    updateSellerProfile,
    changeSellerPassword,
    deleteSellerAccount
};
