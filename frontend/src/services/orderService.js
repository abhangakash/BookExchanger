import api from "./apiConfig";


// 📌 Place a New Order
export const placeOrder = async (orderData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post("/orders/create", orderData, {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error placing order:", error);
        throw new Error(error.response?.data?.message || "Failed to place order.");
    }
};
// ✅ Get Seller Orders (Ensure Correct API Path)
export const getSellerOrders = async () => {
    try {
        const sellerId = localStorage.getItem("userId"); // Get seller ID
        const token = localStorage.getItem("token"); // Get auth token
        const response = await api.get(`/orders/seller/${sellerId}`, {
            headers: { "auth-token": token }, // Attach token
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching seller orders:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch orders.");
    }
};

// ✅ Update Order Status
export const updateOrderStatus = async (orderId, status) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.put(
            `/orders/update/${orderId}`,
            { status },
            { headers: { "auth-token": token } }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating order:", error);
        throw new Error(error.response?.data?.message || "Failed to update order status.");
    }
};

// ✅ Get Orders for the Buyer
export const getBuyerOrders = async () => {
    try {
        const buyerId = localStorage.getItem("userId"); // Get buyer ID
        const token = localStorage.getItem("token");
        const response = await api.get(`/orders/buyer/${buyerId}`, {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching buyer orders:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch orders.");
    }
};