import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sellerSignup, sellerLogin } from "../../services/sellerService"; // Import API services
import "./SellerAuthModal.css";

const SellerAuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        sellerType: "",
        shopName: "",
        shopAddress: "",
    });
    const [error, setError] = useState(""); // Error state for API feedback
    const navigate = useNavigate();

    // Reset form on modal close
    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            sellerType: "",
            shopName: "",
            shopAddress: "",
        });
        setError("");
        setIsLogin(true);
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError(""); // Reset error when switching modes
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = isLogin
                ? await sellerLogin({ email: formData.email, password: formData.password })
                : await sellerSignup(formData);
    
            // ✅ Handle successful response
            alert(response.message);
            resetForm();
            onClose(); // Close modal
    
            // ✅ Save seller info in localStorage after successful login
            if (isLogin && response.token) {
                localStorage.setItem("userId", response.userId);
                localStorage.setItem("userRole", response.role.toLowerCase()); // ✅ Store role as "buyer" or "seller"
                localStorage.setItem("userName", response.name);
                localStorage.setItem("token", response.token);
            }
    
            // ✅ Redirect seller to dashboard after successful login/signup
            navigate("/seller/dashboard");
    
        } catch (error) {
            console.error("Login Error:", error);

            const backendMessage =
                error.response?.data?.message ||
                error.message || // fallback to default axios error
                "Something went wrong";
        
            setError(backendMessage);
        }
    };
    

    const handleModalClose = () => {
        resetForm(); // Reset fields when modal is closed
        onClose();
    };

    if (!isOpen) return null; // Prevent rendering when modal is closed

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="close-button" onClick={handleModalClose}>
                    ✖
                </button>
                <h2>{isLogin ? "Login as Seller" : "Signup as Seller"}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="sellerType">Seller Type</label>
                                <select
                                    id="sellerType"
                                    name="sellerType"
                                    value={formData.sellerType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="shop owner">Shop Owner</option>
                                    <option value="student">Student</option>
                                </select>
                            </div>
                            {formData.sellerType === "shop owner" && (
                                <>
                                    <div className="form-group">
                                        <label htmlFor="shopName">Shop Name</label>
                                        <input
                                            type="text"
                                            id="shopName"
                                            name="shopName"
                                            placeholder="Enter your shop name"
                                            value={formData.shopName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="shopAddress">Shop Address</label>
                                        <input
                                            type="text"
                                            id="shopAddress"
                                            name="shopAddress"
                                            placeholder="Enter your shop address"
                                            value={formData.shopAddress}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="auth-button">
                        {isLogin ? "Login" : "Signup"}
                    </button>
                </form>
                <p onClick={toggleAuthMode} className="toggle-link">
                    {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
                </p>
            </div>
        </div>
    );
};

export default SellerAuthModal;
