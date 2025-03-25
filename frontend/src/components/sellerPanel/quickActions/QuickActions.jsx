import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate hook
import "./QuickActions.css";
import AddBookModal from "../addBookModal/AddBookModal";

const QuickActions = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate(); // ✅ Initialize navigate

    return (
        <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button className="btn-primary" onClick={() => setShowModal(true)}>➕ Add New Book</button>
            <button className="btn-secondary" onClick={() => navigate("/seller/orders")}>📦 View Orders</button>
            <button className="btn-tertiary" onClick={() => navigate("/seller/reports")}>📊 View Reports</button>

            {showModal && <AddBookModal onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default QuickActions;
