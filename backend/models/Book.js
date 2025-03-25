const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookType: {
      type: String,
      enum: ["new", "old"],
      required: true, // Identify if the book is new or old
    },

    title: { type: String, required: true },
    author: { type: String, required: true },
    // genre: { type: String },
    branch: {
      type: String,
      enum: [
          "Computer Science",
          "Mechanical",
          "Civil",
          "Electrical",
          "Electronics",
          "IT",
          "Other",
      ],
      required: true,
  },
    description: { type: String },
    original_price: { type: Number, required: true },
    rentPrice: { type: Number },
    isRentable: { type: Boolean, default: false },
    condition: {
      type: String,
      enum: ["new", "good", "average", "poor"],
      default: "good",
    },
    publicationDate: { type: Date },
    images: [{ type: String }],
    recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],

    // ⭐ Fields Only for OLD Books
    pages: { type: Number }, // Number of pages in the book
    predictedPrice: { type: Number }, // Predicted price from AI model
    acceptPredictedPrice: { type: String, enum: ["yes", "no"] }, // If seller accepted predicted price
    customPrice: { type: Number }, // Custom price if seller rejected predicted price

    // ⭐ Reviews & Ratings
    ratings: {
      average: { type: Number, default: 0 },
      reviews: [
        {
          buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer" },
          rating: { type: Number, min: 1, max: 5 },
          comment: { type: String },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
    rentalStart: { type: Date },
    rentalEnd: { type: Date },
    rentalHistory: [
      {
        renter: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer" },
        rentalStart: { type: Date },
        rentalEnd: { type: Date },
        totalCost: { type: Number },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Book", bookSchema);
