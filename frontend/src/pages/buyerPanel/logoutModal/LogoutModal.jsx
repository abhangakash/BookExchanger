import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./LogoutModal.css";

const LogoutModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate(); // ✅ Initialize navigation

    if (!isOpen) return null;

    // ✅ Logout function: Clear token & redirect
    const handleLogout = () => {
        localStorage.removeItem("token"); // ✅ Remove token
        navigate("/"); // ✅ Redirect to homepage
        onClose(); // ✅ Close modal after logout
    };

    return (
        <div className="logout-modal-overlay">
            <div className="logout-modal">
                <h2>Confirm Logout</h2>
                <p>Are you sure you want to log out?</p>
                <div className="logout-buttons">
                    <button className="logout-confirm" onClick={handleLogout}>Yes, Logout</button>
                    <button className="logout-cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
