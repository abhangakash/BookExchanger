const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    sellerType: { 
        type: String, 
        enum: ['shop owner', 'student'], 
        required: true 
    }, // New field to identify the type of seller
    shopName: { type: String }, // Optional, only for shop owners
    shopAddress: { type: String }, // Optional, only for shop owners
    status: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active'
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Seller', sellerSchema);
