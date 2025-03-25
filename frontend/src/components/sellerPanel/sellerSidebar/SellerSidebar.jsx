import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./SellerSidebar.css";

const SellerSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            navigate("/");
        }
    };

    return (
        <>
            {/* Mobile Navbar */}
            <div className="mobile-navbar">
                <div className="logo">
                    Book<span className="highlight">X</span>changer
                </div>
                <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? "✖" : "☰"}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`seller-sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-logo">
                    Book<span className="highlight">X</span>changer
                </div>
                <ul>
                    <li><NavLink to="/seller/dashboard" activeclassname="active">Dashboard</NavLink></li>
                    <li><NavLink to="/seller/manage-books" activeclassname="active">Manage Books</NavLink></li>
                    <li><NavLink to="/seller/orders" activeclassname="active">Orders</NavLink></li>
                    <li><NavLink to="/seller/reports" activeclassname="active">Reports</NavLink></li>
                    <li><NavLink to="/seller/chats" activeclassname="active">Chats</NavLink></li> {/* ✅ Added Chats Section */}
                    <li><NavLink to="/seller/profile" activeclassname="active">Profile</NavLink></li>
                </ul>

                {/* Logout Button at Bottom */}
                <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
            </aside>
        </>
    );
};

export default SellerSidebar;
