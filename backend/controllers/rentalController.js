const Book = require('../models/Book');
const Rental = require('../models/Rental');

// Rent a book (buyer-specific action)
const rentBook = async (req, res) => {
    try {
        const { bookId, rentalStart, rentalEnd } = req.body;

        // Validate rental dates
        const startDate = new Date(rentalStart);
        const endDate = new Date(rentalEnd);
        if (endDate <= startDate) {
            return res.status(400).json({ message: 'Invalid rental period. End date must be after start date.' });
        }

        // Find the book to be rented
        const book = await Book.findById(bookId);
        if (!book || !book.isRentable) {
            return res.status(400).json({ message: 'Book is not available for rent' });
        }

        // Check if the book is already rented
        if (book.status === 'rented') {
            return res.status(400).json({ message: 'Book is currently rented' });
        }

        // Calculate total rental cost
        const rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const totalCost = rentalDays * book.rentPrice;

        // Create a new rental entry
        const rental = new Rental({
            book: book._id,
            renter: req.user.id, // Authenticated buyer's ID
            owner: book.seller,
            rentalStart: startDate,
            rentalEnd: endDate,
            totalCost,
        });

        await rental.save();

        // Update book status and rental period
        book.status = 'rented';
        book.rentalStart = startDate;
        book.rentalEnd = endDate;
        await book.save();

        res.status(201).json({ message: 'Book rented successfully', rental });
    } catch (error) {
        console.error('Error renting book:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all rentals for the logged-in buyer
const getBuyerRentals = async (req, res) => {
    try {
        const rentals = await Rental.find({ renter: req.user.id })
            .populate('book', 'title author images rentPrice') // Populate book details
            .populate('owner', 'name email'); // Populate seller details

        res.status(200).json(rentals);
    } catch (error) {
        console.error('Error fetching buyer rentals:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all rentals for the logged-in seller
const getSellerRentals = async (req, res) => {
    try {
        const rentals = await Rental.find({ owner: req.user.id })
            .populate('book', 'title author images rentPrice') // Populate book details
            .populate('renter', 'name email'); // Populate buyer details

        res.status(200).json(rentals);
    } catch (error) {
        console.error('Error fetching seller rentals:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    rentBook,
    getBuyerRentals,
    getSellerRentals,
};
