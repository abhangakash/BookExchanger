const Chat = require("../models/Chat");
const Book = require("../models/Book");
const Seller = require("../models/Seller");
const Buyer = require("../models/Buyer");

// 📌 Start a Chat (Only Buyer can initiate)
// 📌 Start a Chat (Only Buyer can initiate)
const startChatWithSeller = async (req, res) => {
    try {
        const { bookId, sellerId } = req.body;
        const buyerId = req.user.id;  // ✅ Ensure token is being used correctly

        console.log("Starting chat with:", { buyerId, bookId, sellerId });

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: "Book not found." });

        // Check if seller exists
        const seller = await Seller.findById(sellerId);
        if (!seller) return res.status(404).json({ message: "Seller not found." });

        // Check if chat already exists
        let chat = await Chat.findOne({ book: bookId, buyer: buyerId, seller: sellerId });

        if (!chat) {
            chat = new Chat({
                book: bookId,
                buyer: buyerId,
                seller: sellerId,
                messages: [],
            });
            await chat.save();
        }

        console.log("Chat Started Successfully:", chat);

        res.status(200).json({ message: "Chat started!", chat });

    } catch (error) {
        console.error("❌ Error starting chat:", error);
        res.status(500).json({ message: "Server error." });
    }
};



// 📌 Send a Message (Buyer & Seller)
// 📌 Send a Message (Buyer & Seller)
const sendMessage = async (req, res) => {
    try {
        const { chatId, message } = req.body;
        const senderId = req.user.id;

        // ✅ Find chat
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found." });

        // ✅ Ensure sender is part of the chat
        if (chat.buyer.toString() !== senderId && chat.seller.toString() !== senderId) {
            return res.status(403).json({ message: "Unauthorized to send messages in this chat." });
        }

        // ✅ Determine sender's role dynamically
        const senderModel = chat.buyer.toString() === senderId ? "Buyer" : "Seller";

        // ✅ Add message
        const newMessage = {
            sender: senderId,
            senderModel,
            message,
            timestamp: new Date()
        };
        chat.messages.push(newMessage);
        chat.lastUpdated = Date.now();
        await chat.save();

        // ✅ Send updated chat
        res.status(200).json({ message: "Message sent!", chat });

    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ message: "Server error." });
    }
};



// 📌 Get Messages for a Chat (Both Buyer & Seller)
const getChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await Chat.findById(chatId)
            .populate({
                path: "book",
                select: "title bookType condition original_price rentPrice isRentable",
            })
            .populate({
                path: "buyer",
                select: "name",
            })
            .populate({
                path: "seller",
                select: "name",
            });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.json(chat);
    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).json({ message: "Failed to fetch chat details" });
    }
};


// 📌 Get all Chats for a User (Both Buyer & Seller)
const getAllChats = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user is authenticated

        const chats = await Chat.find({
            $or: [{ buyer: userId }, { seller: userId }]
        })
        .populate("book", "title images")
        .populate("buyer", "name")
        .populate("seller", "name");

        // Calculate unread messages
        const updatedChats = chats.map(chat => {
            const unreadMessages = chat.messages.filter(
                msg => msg.sender.toString() !== userId && !msg.read
            ).length;

            return { ...chat.toObject(), unreadMessages };
        });

        res.status(200).json(updatedChats);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chats" });
    }
};




// ✅ Get count of unread messages for a buyer
const getUnreadMessages = async (req, res) => {
    try {
        const userId = req.userId;

        const chats = await Chat.find({
            $or: [{ buyer: userId }, { seller: userId }]
        });

        const unreadData = chats.map(chat => {
            const unreadCount = chat.messages.filter(
                msg => msg.sender.toString() !== userId && !msg.read
            ).length;

            return {
                chatId: chat._id,
                unread: unreadCount
            };
        });

        res.status(200).json(unreadData);
    } catch (error) {
        console.error("❌ Error fetching unread messages:", error);
        res.status(500).json({ message: "Server error while fetching unread messages." });
    }
};

// ✅ Mark messages as read when buyer opens a chat
const markChatAsRead = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        chat.messages.forEach(msg => {
            if (msg.sender.toString() !== userId) {
                msg.read = true;
            }
        });

        await chat.save();
        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update message read status" });
    }
};


// 📌 Export Controllers
module.exports = {
    startChatWithSeller,
    sendMessage,
    getChat,
    getAllChats,
    markChatAsRead,
    getUnreadMessages
};
