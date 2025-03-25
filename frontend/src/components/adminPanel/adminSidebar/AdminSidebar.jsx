import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("adminToken");
            navigate("/admin/login");
        }
    };

    return (
        <>
            {/* Mobile Navbar */}
            <div className="admin-mobile-navbar">
                <div className="admin-logo-mobile">
                    Admin<span className="highlight">X</span>Panel
                </div>
                <button className="admin-menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? "✖" : "☰"}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`admin-sidebar-panel ${isOpen ? "open" : ""}`}>
            <div className="admin-sidebar-logo">
                        Admin<span className="highlight">X</span>Panel
                    </div>
                <div className="admin-sidebar-content">
                    

                    <ul className="admin-sidebar-links">
                        <li><NavLink to="/admin/dashboard" activeclassname="active">📊 Dashboard</NavLink></li>
                        <li><NavLink to="/admin/buyers" activeclassname="active">🧑‍🎓 Manage Buyers</NavLink></li>
                        <li><NavLink to="/admin/sellers" activeclassname="active">🧑‍💼 Manage Sellers</NavLink></li>
                        <li><NavLink to="/admin/books" activeclassname="active">📚 Manage Books</NavLink></li>
                        <li><NavLink to="/admin/orders" activeclassname="active">📦 Manage Orders</NavLink></li>
                        <li><NavLink to="/admin/profile" activeclassname="active">👤 Profile</NavLink></li>
                    </ul>

                    <button className="admin-logout-btn" onClick={handleLogout}>🚪 Logout</button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
