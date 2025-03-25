import React, { useEffect, useState } from "react";
import "./Reports.css";
import { Line, Pie } from "react-chartjs-2";
import { getSalesReport, getBestSellingBooks, getOrderSummary } from "../../../services/reportService";

// ✅ Import & Register Chart.js Components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElement, // Required for Pie Chart
    Title,
    Tooltip,
    Legend
);

const Reports = () => {
    const [salesData, setSalesData] = useState(null);
    const [bestSellingBooks, setBestSellingBooks] = useState([]);
    const [orderSummary, setOrderSummary] = useState({ completed: 0, pending: 0, cancelled: 0 });
    const [dateRange, setDateRange] = useState("monthly"); // Default filter
    const [errorMessage, setErrorMessage] = useState(""); // 🟢 Handle error messages
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (dateRange) {
            console.log("📅 Date Range Changed:", dateRange); // ✅ Debugging
            fetchReports();
        }
    }, [dateRange]); // ✅ Trigger fetch when dateRange changes


    const fetchReports = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
    
            // ✅ Fetch sales data dynamically based on date range
            const salesResponse = await getSalesReport(dateRange);
            console.log("📊 Sales Report API Response:", salesResponse);
    
            setSalesData({
                labels: salesResponse.labels.length ? salesResponse.labels : ["No Data"],
                datasets: [
                    {
                        label: "Sales Revenue (₹)",
                        data: salesResponse.salesData.length ? salesResponse.salesData : [0],
                        backgroundColor: "rgba(231, 76, 60, 0.5)",
                        borderColor: "#E74C3C",
                        borderWidth: 2,
                        fill: true,
                    },
                ],
            });
    
            // ✅ Fetch Order Summary
            const orderSummaryResponse = await getOrderSummary(dateRange);
            console.log("📦 Order Summary API Response:", orderSummaryResponse);
            setOrderSummary(orderSummaryResponse || { completed: 0, pending: 0, cancelled: 0 });
    
            // ✅ Fetch Best Selling Books
            const bestSellingBooksResponse = await getBestSellingBooks();
            console.log("📚 Best Selling Books:", bestSellingBooksResponse);
            setBestSellingBooks(bestSellingBooksResponse || []);
    
        } catch (error) {
            setErrorMessage(error.message || "Error fetching reports.");
            console.error("❌ Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };
    





    return (
        <div className="reports-container">
            <h2>📊 Sales & Reports</h2>

            {/* Date Range Selector */}
            <div className="date-range">
                <label>Select Date Range:</label>
                <select
                    value={dateRange}
                    onChange={(e) => {
                        console.log("📆 Selected Date Range:", e.target.value); // ✅ Debugging
                        setDateRange(e.target.value);
                    }}
                >

                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            {/* 🟢 Error Message Display */}
            {errorMessage && <p className="error-message">⚠️ {errorMessage}</p>}

            {loading ? <p>Loading data...</p> : (
                <>
                    {/* 🟢 Charts Row (Sales & Order Summary side by side) */}
                    <div className="charts-row">
                        {/* Sales Performance Chart */}
                        <div className="chart-container">
                            <h3>📈 Sales Performance</h3>
                            {salesData ? <Line key={JSON.stringify(salesData)} data={salesData} /> : <p>No sales data available.</p>}
                        </div>

                        {/* Order Summary Pie Chart */}
                        <div className="chart-container">
                            <h3>📦 Order Summary</h3>
                            <Pie
                                key={Date.now()} // 🔄 Fix Chart.js re-rendering issue
                                data={{
                                    labels: ["Completed", "Pending", "Cancelled"],
                                    datasets: [
                                        {
                                            data: [
                                                orderSummary.completed || 0,
                                                orderSummary.pending || 0,
                                                orderSummary.cancelled || 0,
                                            ],
                                            backgroundColor: ["#2ECC71", "#F1C40F", "#E74C3C"],
                                        },
                                    ],
                                }}
                            />
                        </div>
                    </div>

                    {/* 🟢 Best-Selling Books Table */}
                    <div className="best-sellers">
                        <h3>🏆 Best-Selling Books</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Book Title</th>
                                    <th>Sales</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bestSellingBooks.length > 0 ? (
                                    bestSellingBooks.map((book, index) => (
                                        <tr key={index}>
                                            <td>{book.title}</td>
                                            <td>{book.sales}</td>
                                            <td>₹{book.revenue}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">No best-selling books available.</td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>

                    {/* Export Button */}
                    <div className="export-report">
                        <button>📄 Download Report</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Reports;
