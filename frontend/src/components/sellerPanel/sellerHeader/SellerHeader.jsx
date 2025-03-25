import React from "react";
import "./SellerHeader.css";
import { FaSearch, FaBell } from "react-icons/fa";

const SellerHeader = () => {
    return (
        <header className="seller-header">
            {/* Logo */}
            <div className="logo">
                <h1>Book<span>X</span>changer</h1>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Search..." />
            </div>

            {/* Right Section: Notifications & Profile */}
            <div className="header-right">
                <FaBell className="notification-icon" />
                <div className="seller-profile">
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Seller"
                        className="profile-pic"
                    />
                    <span>Dipak Deb Nath</span>
                </div>
            </div>
        </header>
    );
};

export default SellerHeader;
