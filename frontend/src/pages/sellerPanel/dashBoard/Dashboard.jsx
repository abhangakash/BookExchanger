import React from "react";
import SellerSidebar from "../../../components/sellerPanel/sellerSidebar/SellerSidebar";
import SellerStats from "../../../components/sellerPanel/sellerStats/SellerStats";
import SalesCharts from "../../../components/sellerPanel/salesCharts/SalesCharts";
import RecentOrders from "../../../components/sellerPanel/recentOrders/RecentOrders";
import QuickActions from "../../../components/sellerPanel/quickActions/QuickActions";
import "./Dashboard.css";

const Dashboard = () => {
    return (
        <div className="seller-dashboard">
            <SellerSidebar />
            <div className="dashboard-content">

                {/* Top Section - Seller Stats */}
                <section className="dashboard-top">
                    <SellerStats />
                </section>

                {/* Middle Section - Charts & Quick Actions */}
                <section className="dashboard-middle">
                    <SalesCharts />
                    <QuickActions />
                </section>

                {/* Bottom Section - Recent Orders */}
                <section className="dashboard-bottom">
                    <RecentOrders />
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
