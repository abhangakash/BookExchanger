import api from "./apiConfig";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found. Please log in.");
    return { headers: { "Authorization": `Bearer ${token}` } }; // ✅ Correct token format
};

// ✅ Get Sales Report
export const getSalesReport = async (range) => {
    try {
        const response = await api.get(`/seller/reports/sales?range=${range}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching sales report:", error.response?.data || error.message);
        throw new Error("Failed to fetch sales report.");
    }
};

// ✅ Get Best-Selling Books
export const getBestSellingBooks = async () => {
    try {
        const response = await api.get("/seller/reports/best-sellers", getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching best-selling books:", error.response?.data || error.message);
        throw new Error("Failed to fetch best-selling books.");
    }
};


// ✅ Get Order Summary
export const getOrderSummary = async (range) => {
    try {
        console.log("🚀 Sending request for Order Summary:", range); // ✅ Debugging
        const response = await api.get(`/seller/reports/orders-summary?range=${range}`, getAuthHeaders());
        console.log("✅ Order Summary Response:", response.data); // ✅ Debugging
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching order summary:", error.response?.data || error.message);
        throw new Error("Failed to fetch order summary.");
    }
};

