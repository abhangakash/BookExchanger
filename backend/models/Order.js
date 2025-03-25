const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    
    orderType: {
      type: String,
      enum: ["purchase", "rent"], // New field to differentiate between purchase and rental
      required: true
    },
    
    deliveryAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    
    // For purchase orders
    price: { type: Number, required: true },

    // For rental orders
    rentDays: { type: Number }, // Number of days rented
    rentStartDate: { type: Date },
    rentEndDate: { type: Date },
    totalRentPrice: { type: Number }, // Total calculated rent price

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
