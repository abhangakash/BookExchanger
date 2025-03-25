const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, refPath: "senderModel", required: true }, // Sender ID
    senderModel: { type: String, enum: ["Buyer", "Seller"], required: true }, // Sender type
    message: { type: String, required: true }, // Message content
    timestamp: { type: Date, default: Date.now }, // Message timestamp
    read: { type: Boolean, default: false } // ✅ Add "isRead" for unread messages
});

const chatSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }, // Book being discussed
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer", required: true }, // Buyer who initiates chat
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true }, // Seller of the book
    messages: [messageSchema], // ✅ Store messages with read status
    lastUpdated: { type: Date, default: Date.now }, // Helps in sorting chats by recent activity
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
