import React, { useState, useEffect } from "react";
import { getAllChats, getChatById, markMessagesAsRead } from "../../../services/chatService";
import BuyerChatModal from "./BuyerChatModal"; // ✅ Import modal
import { io } from "socket.io-client";
import "./BuyerChats.css";

const socket = io("http://localhost:5000"); // ✅ Connect to WebSocket server

const BuyerChats = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [showChatModal, setShowChatModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const chatData = await getAllChats();
                const sortedChats = chatData.sort(
                    (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated) // ✅ Sort chats by lastUpdated (latest first)
                );
                setChats(sortedChats);
            } catch (error) {
                console.error("Error fetching chats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();

        // ✅ Listen for new messages
        socket.on("receive_message", (newMessage) => {
            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat._id === newMessage.chatId
                        ? { ...chat, unreadMessages: chat.unreadMessages + 1 }
                        : chat
                )
            );
        });

        return () => socket.off("receive_message");
    }, []);

    const handleChatClick = async (chatId) => {
        try {
            const chatDetails = await getChatById(chatId);
            setSelectedChat(chatDetails);
            setShowChatModal(true);

            // ✅ Mark messages as read
            await markMessagesAsRead(chatId);
            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat._id === chatId ? { ...chat, unreadMessages: 0 } : chat
                )
            );
        } catch (error) {
            console.error("Error fetching chat details:", error);
        }
    };

    return (
        <div className="buyer-chats-container">
            <h2>📩 Your Chats</h2>
            {loading ? (
                <p>Loading chats...</p>
            ) : chats.length === 0 ? (
                <p>No active chats.</p>
            ) : (
                <div className="chat-list">
                    {chats.map((chat) => (
                        <div key={chat._id} className="chat-item" onClick={() => handleChatClick(chat._id)}>
                            <img src={chat.book.images?.[0] || "/default-book.jpg"} alt={chat.book.title} className="book-image" />
                            <div className="chat-details">
                                <h3>{chat.book.title}</h3>
                                <p>👤 Seller: {chat.seller.name || "Unknown"}</p>
                                <p>📅 Last Updated: {new Date(chat.lastUpdated).toLocaleString()}</p>
                            </div>
                            {/* ✅ Show unread message count (Always Visible) */}
                            {chat.unreadMessages > 0 && <span className="unread-badge">{chat.unreadMessages}</span>}
                        </div>
                    ))}
                </div>
            )}

            {/* ✅ Show Buyer Chat Modal when a chat is selected */}
            {showChatModal && selectedChat && (
                <BuyerChatModal chatId={selectedChat._id} onClose={() => setShowChatModal(false)} />
            )}
        </div>
    );
};

export default BuyerChats;
