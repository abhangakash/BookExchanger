import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate for redirection
import { buyerSignup, buyerLogin } from "../../services/buyerService"; // Import services
import "./BuyerAuthModal.css";

const BuyerAuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate(); // ✅ Initialize navigate for redirection

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            address: "",
        });
        setError("");
        setIsLogin(true);
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = isLogin
                ? await buyerLogin({ email: formData.email, password: formData.password })
                : await buyerSignup(formData);
    
            // ✅ Handle successful response
            alert(response.message);
            resetForm();
            onClose(); // Close the modal
    
            // ✅ Save user info in localStorage after successful login
            if (isLogin && response.token) {
                localStorage.setItem("userId", response.userId);
                localStorage.setItem("userRole", response.role.toLowerCase()); // ✅ Ensure lowercase "buyer" or "seller"
                localStorage.setItem("userName", response.name);
                localStorage.setItem("token", response.token);
            }
    
            // ✅ Redirect to Buyer Dashboard after successful login
            if (isLogin) {
                navigate("/buyer/dashboard");
            }
    
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
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="close-button" onClick={handleModalClose}>✖</button>
                <h2>{isLogin ? "Login as Buyer" : "Signup as Buyer"}</h2>
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
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    placeholder="Enter your address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
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
                    {isLogin
                        ? "Don't have an account? Signup"
                        : "Already have an account? Login"}
                </p>
            </div>
        </div>
    );
};

export default BuyerAuthModal;
