import React, { useState, useEffect } from "react";
import { getAllChats, getChatById, markMessagesAsRead } from "../../../services/chatService";
import SellerChatModal from "./SellerChatModal";
import { io } from "socket.io-client";
import "./SellerChats.css";

const socket = io("http://localhost:5000");

const SellerChats = () => {
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

        socket.on("receive_message", (newMessage) => {
            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat._id === newMessage.chatId
                        ? { ...chat, unreadMessages: (chat.unreadMessages || 0) + 1 }
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

            await markMessagesAsRead(chatId);

            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat._id === chatId ? { ...chat, unreadMessages: 0 } : chat
                )
            );
        } catch (error) {
            console.error("Error opening chat:", error);
        }
    };

    return (
        <div className="seller-chats-container">
            <h2>📩 Buyer Chats</h2>
            {loading ? (
                <p>Loading chats...</p>
            ) : chats.length === 0 ? (
                <p>No chats available.</p>
            ) : (
                <div className="chat-list">
                    {chats.map((chat) => (
                        <div key={chat._id} className="chat-item" onClick={() => handleChatClick(chat._id)}>
                            <img src={chat.book?.images?.[0] || "/default-book.jpg"} alt="Book" className="book-image" />
                            <div className="chat-details">
                                <h3>{chat.book?.title || "Unknown Book"}</h3>
                                <p>👤 Buyer: {chat.buyer?.name || "Unknown"}</p>
                                <p>📅 Last Updated: {new Date(chat.lastUpdated).toLocaleString()}</p>
                            </div>
                            {chat.unreadMessages > 0 && <span className="unread-badge">{chat.unreadMessages}</span>}
                        </div>
                    ))}
                </div>
            )}

            {showChatModal && selectedChat && (
                <SellerChatModal chatId={selectedChat._id} onClose={() => setShowChatModal(false)} />
            )}
        </div>
    );
};

export default SellerChats;
