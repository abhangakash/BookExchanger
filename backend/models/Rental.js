const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // Reference to the rented book
    renter: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true }, // Renter's ID
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }, // Seller's ID
    rentalStart: { type: Date, required: true }, // Rental start date
    rentalEnd: { type: Date, required: true }, // Rental end date
    totalCost: { type: Number, required: true }, // Total cost of the rental
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' }, // Rental status
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Rental', rentalSchema);
