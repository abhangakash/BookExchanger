import React, { useEffect, useState } from "react";
import "./RecentOrders.css";
import { getRecentOrders } from "../../../services/dashboardService";

const RecentOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getRecentOrders();
            setOrders(response); // ✅ Store API response directly
        } catch (error) {
            console.error("Error fetching recent orders:", error);
        }
    };

    return (
        <div className="recent-orders">
            <h3>Recent Orders</h3>
            <table>
                <thead>
                    <tr>
                        <th>Book</th>
                        <th>Order Type</th>
                        <th>Buyer</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order.book?.title || "Unknown Book"}</td>
                                <td>{order.orderType === "rent" ? "📅 Rent" : "🛍 Purchase"}</td>
                                <td>{order.buyer?.name || "Unknown Buyer"}</td>
                                <td>₹{order.price || "N/A"}</td>
                                <td>{getOrderStatusIcon(order.status)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No recent orders found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// ✅ Convert Order Status into Icons
const getOrderStatusIcon = (status) => {
    switch (status) {
        case "Pending":
            return "⏳ Pending";
        case "Shipped":
            return "🚚 Shipped";
        case "Delivered":
            return "✅ Delivered";
        case "Cancelled":
            return "❌ Cancelled";
        default:
            return "Unknown";
    }
};

export default RecentOrders;
