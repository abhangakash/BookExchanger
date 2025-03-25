import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "./SalesCharts.css";
import { getSalesChartData } from "../../../services/dashboardService";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesCharts = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        try {
            setLoading(true);
            setChartData(null); // Prevents displaying old data while fetching

            const response = await getSalesChartData();
            console.log("📊 API Response:", response);

            if (!response || Object.keys(response).length === 0) {
                setLoading(false);
                return;
            }

            const totalSales = response.totalSales || 0;
            const totalOrders = response.ordersCount || 0; 

            console.log("✅ Total Sales:", totalSales);
            console.log("✅ Total Orders:", totalOrders);

            setChartData({
                labels: ["Total Sales", "Total Orders"],
                datasets: [
                    {
                        label: "Sales (₹)",
                        data: [totalSales, 0], // Sales bar uses left y-axis
                        backgroundColor: "#E74C3C",
                        yAxisID: "y",
                    },
                    {
                        label: "Orders",
                        data: [0, totalOrders], // Orders bar uses right y-axis
                        backgroundColor: "#3498DB",
                        yAxisID: "y1",
                    },
                ],
            });
        } catch (error) {
            console.error("❌ Error fetching sales chart data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sales-chart">
            <h2>📊 Sales Performance</h2>

            {loading ? (
                <p>Loading sales data...</p>
            ) : chartData && chartData.labels.length > 0 ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { display: true },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        return context.dataset.label === "Orders"
                                            ? `${context.formattedValue} Orders`
                                            : `₹${context.formattedValue}`;
                                    },
                                },
                            },
                        },
                        scales: {
                            y: {
                                type: "linear",
                                display: true,
                                position: "left",
                                title: { display: true, text: "Sales (₹)" },
                                ticks: {
                                    callback: (value) => `₹${value}`,
                                },
                            },
                            y1: {
                                type: "linear",
                                display: true,
                                position: "right",
                                title: { display: true, text: "Orders" },
                                ticks: {
                                    stepSize: 1, // Makes orders more visible
                                    callback: (value) => `${value} Orders`,
                                },
                                grid: { drawOnChartArea: false }, // Prevents overlap
                            },
                            x: {
                                title: { display: true, text: "Category" },
                            },
                        },
                    }}
                />
            ) : (
                <p>No sales data available.</p>
            )}
        </div>
    );
};

export default SalesCharts;
