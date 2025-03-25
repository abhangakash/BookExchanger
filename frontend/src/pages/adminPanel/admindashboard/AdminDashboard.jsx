import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/adminPanel/adminSidebar/AdminSidebar";
import { getDashboardStats } from "../../../services/adminService";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [stats, setStats] = useState({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);

    const chartData = [
        { name: "Buyers", value: stats.buyerCount || 0 },
        { name: "Sellers", value: stats.sellerCount || 0 },
        { name: "Books", value: stats.bookCount || 0 },
        { name: "Orders", value: stats.orderCount || 0 },
    ];

    return (
        <div className="admin-dashboard-wrapper">
            <AdminSidebar />
            <div className="admin-dashboard-content">
                {/* Top - Stats */}
                <section className="admin-dashboard-top">
                    <div className="admin-stats-container">
                        <div className="admin-stat-card admin-card-blue">
                            <h3>Total Books</h3>
                            <p>{stats.bookCount}</p>
                        </div>
                        <div className="admin-stat-card admin-card-green">
                            <h3>Buyers</h3>
                            <p>{stats.buyerCount}</p>
                        </div>
                        <div className="admin-stat-card admin-card-yellow">
                            <h3>Sellers</h3>
                            <p>{stats.sellerCount}</p>
                        </div>
                        <div className="admin-stat-card admin-card-purple">
                            <h3>Orders</h3>
                            <p>{stats.orderCount}</p>
                        </div>
                    </div>
                </section>

                {/* Middle - Chart */}
                <section className="admin-dashboard-middle">
                    <div className="admin-chart-container">
                        <h3>📈 Overview Chart</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#6366f1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
