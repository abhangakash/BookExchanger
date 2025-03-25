import React, { useEffect, useState } from "react";
import "./SellerStats.css";
import { getSellerDashboardStats } from "../../../services/dashboardService";

const SellerStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await getSellerDashboardStats();
            console.log("📊 Seller Stats Response:", response); // ✅ Debugging Log
            // setStats(response);
            setStats({
                totalSales: response?.totalSales ?? 0,
                totalRevenue: response?.totalRevenue ?? 0,
                booksSold: response?.booksSold ?? 0,
                totalBooksListed: response?.totalBooksListed ?? 0
            });
        } catch (error) {
            console.error("Error fetching seller stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="seller-stats-container">
            {loading ? (
                <p>Loading stats...</p>
            ) : stats ? (
                <div className="seller-stats">
                    <div className="stat-card">
                        <h3>Total Sales</h3>
                        <p>{stats.totalSales ?? 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <p>₹{stats.totalRevenue ?? 0}</p> {/* ✅ Now displays only delivered revenue */}
                    </div>
                    <div className="stat-card">
                        <h3>Books Sold</h3>
                        <p>{stats.booksSold ?? 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Books Listed</h3>
                        <p>{stats.totalBooksListed ?? 0}</p>
                    </div>
                </div>
            ) : (
                <p>Error loading stats</p>
            )}
        </div>
    );
};

export default SellerStats;
