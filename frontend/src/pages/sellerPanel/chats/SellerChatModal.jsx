import React, { useState, useEffect, useRef } from "react";
import { getChatById, sendMessage } from "../../../services/chatService";
import { io } from "socket.io-client";
import CreateOrderModal from "../../../components/sellerPanel/CreateOrder/CreateOrderModal";
import { BASE_URL } from "../../../services/apiConfig"; // ✅ Import the base URL
import "./SellerChatModal.css";

const socket = io(BASE_URL); // ✅ Use shared base URL here

const SellerChatModal = ({ chatId, onClose }) => {
    const [chat, setChat] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const userId = localStorage.getItem("userId");
    const messagesEndRef = useRef(null);

    const formatTime = (timestamp) => {
        if (!timestamp) return "Just now";
        const now = new Date();
        const msgTime = new Date(timestamp);
        const diff = Math.abs(now - msgTime) / 1000;
        if (diff < 60) return "Just now";
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
            socket.emit("send_message", { chatId, sender: userId, senderModel: "Seller", message });
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    if (loading || !chat) return null;

    return (
        <div className="chat-modal-backdrop" onClick={onClose}>
            <div className="seller-chat-window modal" onClick={(e) => e.stopPropagation()}>
                <span className="chat-modal-close-btn" onClick={onClose}>❌</span>
                <h2 className="seller-chat-title">Chat with {chat?.buyer?.name || "Buyer"}</h2>

                <div className="seller-messages-container">
                    {chat?.messages.map((msg, index) => {
                        const isSeller = msg.senderModel === "Seller";
                        return (
                            <div key={index} className={`seller-message-wrapper ${isSeller ? "seller-message" : "seller-buyer-message"}`}>
                                <div className="seller-message-content">
                                <p dangerouslySetInnerHTML={{ __html: msg.message.replace(/\n/g, "<br>") }}></p>

                                    <span className="seller-timestamp">{formatTime(msg.timestamp)}</span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="seller-message-input">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={handleSendMessage} disabled={!message.trim()}>Send</button>
                </div>

                <div className="seller-order-btn-container">
                    <button className="create-order-btn" onClick={() => setShowOrderModal(true)}>
                        Create Order
                    </button>
                </div>
            </div>

            {/* ✅ Move `CreateOrderModal` outside `.seller-chat-window` to ensure it shows as a true modal */}
            {showOrderModal && (
                <CreateOrderModal
                    chat={chat}
                    onClose={() => setShowOrderModal(false)}
                    onOrderCreated={() => {
                        setShowOrderModal(false);
                        // optionally show toast / update UI
                    }}
                />
            )}
        </div>
    );
};

export default SellerChatModal;
