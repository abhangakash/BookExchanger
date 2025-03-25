import axios from "axios";



// services/apiConfig.js
const BASE_URL = "https://bookexchanger-backend.onrender.com";

// use this link for local machine run
// const BASE_URL = "http://localhost:5000";


const instance = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use((config) => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("token");
  
    const token = adminToken || userToken; // ✅ Define token here
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;
export { BASE_URL }; // <-- Export the base URL
