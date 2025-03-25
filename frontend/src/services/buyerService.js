import axios from "./apiConfig";

// Buyer Signup API
export const buyerSignup = async (data) => {
    const response = await axios.post("/buyer/signup", data);
    return response.data;
};

// Buyer Login API
export const buyerLogin = async (data) => {
    try {
        const response = await axios.post("/buyer/login", data);
        
        // ✅ Save the token in localStorage after successful login
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }

        return response.data;
    } catch (error) {
        console.error("Error logging in:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Login failed.");
    }
};