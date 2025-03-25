const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String }, // Optional field
    status: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active'
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Buyer', buyerSchema);
