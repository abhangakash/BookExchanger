import { useEffect, useState } from 'react';
import AdminSidebar from "../../../components/adminPanel/adminSidebar/AdminSidebar";
import { getAllOrders } from '../../../services/adminService';
import './ManageOrders.css';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            const data = await getAllOrders();
            setOrders(data);
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) =>
        order.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-orders-wrapper">
            <AdminSidebar />
            <div className="admin-orders-content">
                {/* <h2 className="admin-orders-title">📦 Manage Orders</h2> */}

                <input
                    type="text"
                    placeholder="Search by book, buyer or seller"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-orders-search"
                />

                <div className="admin-orders-table-wrapper">
                    <table className="admin-orders-table">
                        <thead>
                            <tr>
                                <th>Book Title</th>
                                <th>Buyer</th>
                                <th>Buyer Email</th>
                                <th>Seller</th>
                                <th>Seller Email</th>
                                <th>Order Type</th>
                                <th>Price</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order.book?.title || 'N/A'}</td>
                                        <td>{order.buyer?.name || 'N/A'}</td>
                                        <td>{order.buyer?.email || 'N/A'}</td>
                                        <td>{order.seller?.name || 'N/A'}</td>
                                        <td>{order.seller?.email || 'N/A'}</td>
                                        <td>{order.orderType || 'N/A'}</td>
                                        <td>₹{order.price ?? 'N/A'}</td>
                                        <td>{order.phoneNumber || 'N/A'}</td>
                                        <td>{order.deliveryAddress || 'N/A'}</td>
                                        <td>{order.status}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="admin-orders-empty-msg">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageOrders;
