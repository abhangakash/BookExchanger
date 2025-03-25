import React, { useState } from "react";
import { placeOrder } from "../../../services/orderService";
import { sendMessage } from "../../../services/chatService";
import { io } from "socket.io-client";
import "./CreateOrderModal.css";

const socket = io("http://localhost:5000");

const CreateOrderModal = ({ chat, onClose, onOrderCreated }) => {
    const book = chat?.book || {};
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [price, setPrice] = useState(book.original_price || "");
    const [orderType, setOrderType] = useState("purchase");
    const [rentPricePerDay, setRentPricePerDay] = useState(book.rentPrice || "");
    const [rentDays, setRentDays] = useState("");
    const [totalRentPrice, setTotalRentPrice] = useState("");
    const [rentStartDate, setRentStartDate] = useState("");
    const [rentEndDate, setRentEndDate] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Handle Rent Calculation
    const handleRentDaysChange = (days) => {
        setRentDays(days);
        const calculatedTotalRent = days * rentPricePerDay;
        setTotalRentPrice(calculatedTotalRent);

        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + Number(days));
        setRentStartDate(start.toISOString().split("T")[0]);
        setRentEndDate(end.toISOString().split("T")[0]);
    };

    // ✅ Handle Order Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            // ✅ Debug: Ensure values exist before sending
            console.log("Before Submitting Order:", {
                rentStartDate,
                rentEndDate,
                rentDays,
                orderType
            });
    
            // Ensure rent start & end date are correctly set
            const rentStart = orderType === "rent" ? rentStartDate || new Date().toISOString().split("T")[0] : null;
            const rentEnd = orderType === "rent" ? rentEndDate || new Date(new Date().setDate(new Date().getDate() + Number(rentDays))).toISOString().split("T")[0] : null;
    
            const orderData = {
                chatId: chat._id,
                buyerId: chat.buyer._id,
                sellerId: chat.seller._id,
                bookId: book._id,
                deliveryAddress,
                phoneNumber,
                price: orderType === "rent" ? totalRentPrice : price,
                orderType,
                rentDays: orderType === "rent" ? rentDays : null,
                rentStartDate: rentStart,
                rentEndDate: rentEnd
            };
    
            console.log("Final Order Data Sent:", orderData); // ✅ Log Data Before Sending
    
            await placeOrder(orderData);
    
            // ✅ Order Confirmation Message in Chat
            const orderMessage = `
    ✅ **Order Placed Successfully!**
    📚 **Book:** ${book.title}
    📖 **Type:** ${orderType === "rent" ? `📅 Rent (${rentDays} days)` : "🛍 Purchase"}
    🗓 **Rent Period:** ${orderType === "rent" ? `${rentStart} to ${rentEnd}` : "N/A"}
    💰 **Price:** ₹${orderData.price}
    🚚 **Delivery Address:** ${deliveryAddress}
    📞 **Phone:** ${phoneNumber}
            `;
    
            // ✅ Send System Message in Chat
            await sendMessage(chat._id, orderMessage);
            socket.emit("send_message", { 
                chatId: chat._id, 
                sender: "System", 
                senderModel: "System", 
                message: orderMessage 
            });
    
            onOrderCreated();
            onClose();
        } catch (error) {
            console.error("Error creating order:", error);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="order-modal-backdrop" onClick={onClose}>
            <div className="order-modal" onClick={(e) => e.stopPropagation()}>
                <span className="close-btn" onClick={onClose}>❌</span>
                <h2>Create Order</h2>
                <form onSubmit={handleSubmit}>
                    <p><strong>📚 Book Name:</strong> {book.title || "N/A"}</p>
                    <p><strong>📖 Book Type:</strong> {book.bookType || "N/A"}</p>
                    <p><strong>🔍 Condition:</strong> {book.condition || "N/A"}</p>

                    {book.isRentable && (
                        <>
                            <label>Order Type</label>
                            <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                                <option value="purchase">Purchase</option>
                                <option value="rent">Rent</option>
                            </select>
                        </>
                    )}

                    {orderType === "rent" && book.isRentable && (
                        <>
                            <label>Rent Price (Per Day)</label>
                            <input type="number" value={rentPricePerDay} readOnly />

                            <label>Number of Days</label>
                            <input type="number" value={rentDays} onChange={(e) => handleRentDaysChange(e.target.value)} required />

                            <p><strong>Total Rent Price:</strong> ₹{totalRentPrice || "0"}</p>
                            <p><strong>Start Date:</strong> {rentStartDate || "--"}</p>
                            <p><strong>End Date:</strong> {rentEndDate || "--"}</p>
                        </>
                    )}

                    <p><strong>👤 Buyer:</strong> {chat.buyer?.name || "N/A"}</p>

                    <label>Delivery Address</label>
                    <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} required />

                    <label>Phone Number</label>
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />

                    {orderType === "purchase" && (
                        <>
                            <label>Price</label>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Placing Order..." : orderType === "rent" ? "Place Rent Order" : "Place Order"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateOrderModal;
