import api from "./apiConfig";

// ✅✅Seller Profile 


// ✅ Fetch Seller Profile
export const getSellerProfile = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/seller/profile", {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch profile.");
    }
};

// ✅ Update Seller Profile
export const updateSellerProfile = async (profileData) => {
    try {
        const token = localStorage.getItem("token");

        const response = await api.put("/seller/profile", profileData, {
            headers: { "auth-token": token },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw new Error(error.response?.data?.message || "Failed to update profile.");
    }
};


// ✅ Change Password
export const changeSellerPassword = async (passwordData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.put("/seller/change-password", passwordData, {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw new Error(error.response?.data?.message || "Failed to change password.");
    }
};

// ✅ Delete Account
export const deleteSellerAccount = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.delete("/seller/delete-account", {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting account:", error);
        throw new Error(error.response?.data?.message || "Failed to delete account.");
    }
};

//✅✅ buyer services


// ✅ Get Buyer Profile
export const getBuyerProfile = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/buyer/profile", {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching buyer profile:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch profile.");
    }
};

// ✅ Update Buyer Profile
export const updateBuyerProfile = async (profileData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.put("/buyer/profile", profileData, {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw new Error(error.response?.data?.message || "Failed to update profile.");
    }
};

// ✅ Change Buyer Password
export const changeBuyerPassword = async (passwordData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.put("/buyer/change-password", passwordData, {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw new Error(error.response?.data?.message || "Failed to change password.");
    }
};

// ✅ Delete Buyer Account
export const deleteBuyerAccount = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.delete("/buyer/delete-account", {
            headers: { "auth-token": token },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting account:", error);
        throw new Error(error.response?.data?.message || "Failed to delete account.");
    }
};
