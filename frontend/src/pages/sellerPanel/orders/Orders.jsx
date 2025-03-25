import React, { useState, useEffect } from "react";
import "./Orders.css";
import { getSellerOrders, updateOrderStatus } from "../../../services/orderService";

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getSellerOrders();
    
            // Sort orders by createdAt in descending order (newest first)
            const sortedOrders = response.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
    
            setOrders(sortedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    return (
        <div className="orders-container">
            {/* <h2>📦 Manage Orders</h2> */}

            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Book</th>
                        <th>Book Type</th>
                        <th>Order Type</th>
                        <th>Buyer</th>
                        <th>Price</th>
                        <th>Rent Period</th>
                        <th>Delivery Address</th>
                        <th>Phone Number</th>
                        <th>Status</th>
                        <th>Ordered On</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id.slice(-6).toUpperCase()}</td>
                                <td className="wrap-text">{order.book ? order.book.title : "Unknown Book"}</td>
                                <td>{order.book ? order.book.bookType : "N/A"}</td>
                                <td>{order.orderType === "rent" ? "Rent" : "Purchase"}</td>
                                <td>{order.buyer ? order.buyer.name : "Unknown Buyer"}</td>
                                <td>₹{order.price}</td>
                                <td>
                                    {order.orderType === "rent"
                                        ? `${new Date(order.rentStartDate).toLocaleDateString()} - ${new Date(order.rentEndDate).toLocaleDateString()} (${order.rentDays} days)`
                                        : "N/A"}
                                </td>
                                <td className="wrap-text">{order.deliveryAddress}</td>
                                <td>{order.phoneNumber}</td>
                                <td>
                                    {/* ✅ Status Dropdown Inside Table */}
                                    <select
                                        className={`status ${order.status.toLowerCase()}`}
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11">No orders found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;
