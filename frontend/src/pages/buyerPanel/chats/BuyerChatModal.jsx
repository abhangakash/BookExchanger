import React, { useState, useEffect, useRef } from "react";
import { getChatById, sendMessage } from "../../../services/chatService";
import { BASE_URL } from "../../../services/apiConfig"; // ✅ Import the base URL
import { io } from "socket.io-client";
import "./BuyerChatModal.css";

const socket = io(BASE_URL); // ✅ Use shared base URL here

const BuyerChatModal = ({ chatId, onClose }) => {
    const [chat, setChat] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");
    const messagesEndRef = useRef(null);
    const [notifications, setNotifications] = useState([]);
    

    const formatTime = (timestamp) => {
        if (!timestamp) return "Just now";
        const now = new Date();
        const msgTime = new Date(timestamp);
        const diff = Math.abs(now - msgTime) / 1000; // Difference in seconds
       

        if (diff < 60) return "Just now"; // Show "Just now" if within 60 seconds

        return msgTime.toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const chatData = await getChatById(chatId);
                setChat(chatData);
            } catch (error) {
                console.error("Error fetching chat:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChat();
        socket.emit("join_chat", chatId);

        socket.on("receive_message", (newMessage) => {
            setChat((prevChat) => ({
                ...prevChat,
                messages: [...prevChat.messages, newMessage]
            }));
        });

        return () => socket.off("receive_message");
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        try {
            await sendMessage(chatId, message);
            socket.emit("send_message", { chatId, sender: userId, senderModel: "Buyer", message });
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    

    useEffect(() => {
        if (userId) {
            socket.emit("join", userId); // ✅ Join socket room for buyer
        }

        // ✅ Listen for Order Placed Event
        socket.on("order_placed", (data) => {
            setNotifications((prev) => [...prev, data.message]);
        });

        return () => socket.off("order_placed");
    }, [userId]);

    if (loading || !chat) return null;

    return (
        <div className="chat-modal-backdrop" onClick={onClose}>
             {notifications.length > 0 && (
                <div className="notification-container">
                    {notifications.map((note, index) => (
                        <p key={index} className="notification">{note}</p>
                    ))}
                </div>
            )}
            <div className="buyer-chat-window modal" onClick={(e) => e.stopPropagation()}>
                 {/* ✅ Show Order Notifications */}
           

                <span className="chat-modal-close-btn" onClick={onClose}>❌</span>
                <h2 className="buyer-chat-title">Chat with {chat?.seller?.name || "Seller"}</h2>

                <div className="buyer-messages-container">
                    {chat?.messages.map((msg, index) => {
                        const isBuyer = msg.senderModel === "Buyer";
                        return (
                            <div key={index} className={`buyer-message-wrapper ${isBuyer ? "buyer-message" : "buyer-seller-message"}`}>
                                <div className="buyer-message-content">
                                <p dangerouslySetInnerHTML={{ __html: msg.message.replace(/\n/g, "<br>") }}></p>

                                    <span className="buyer-timestamp">{formatTime(msg.timestamp)}</span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="buyer-message-input">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={handleSendMessage} disabled={!message.trim()}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default BuyerChatModal;
