import api from "./apiConfig";

// ✅ Get Seller Dashboard Stats
export const getSellerDashboardStats = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/dashboard/seller/stats", {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch stats.");
    }
};

// ✅ Get Recent Orders
export const getRecentOrders = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/dashboard/seller/recent-orders", {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching recent orders:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch orders.");
    }
};

// ✅ Get Sales Chart Data
// ✅ Get Sales Chart Data
export const getSalesChartData = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/dashboard/seller/sales-chart", {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching sales data:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch sales data.");
    }
};


