import api from "./apiConfig";

export const sellerSignup = async (data) => {
    const response = await api.post("/seller/signup", data);
    return response.data;
};

export const sellerLogin = async (data) => {
    try {
        const response = await api.post("/seller/login", data);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token); // ✅ Save Token in Local Storage
        }
        return response.data;
    } catch (error) {
        console.error("Login failed:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Login failed.");
    }
};
