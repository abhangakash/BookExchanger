import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Navbar.css";
import BuyerAuthModal from "../BuyerAuthModal/BuyerAuthModal"; // Import Buyer modal
import SellerAuthModal from "../SellerAuthModal/SellerAuthModal"; // Import Seller modal
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the dropdown menu
    const [isBuyerModalOpen, setIsBuyerModalOpen] = useState(false); // State to toggle the Buyer modal
    const [isSellerModalOpen, setIsSellerModalOpen] = useState(false); // State to toggle the Seller modal

    const navigate = useNavigate(); // Initialize navigate

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle menu state
    };

    const openBuyerModal = () => {
        setIsBuyerModalOpen(true); // Open Buyer modal
    };

    const closeBuyerModal = () => {
        setIsBuyerModalOpen(false); // Close Buyer modal
    };

    const openSellerModal = () => {
        setIsSellerModalOpen(true); // Open Seller modal
    };

    const closeSellerModal = () => {
        setIsSellerModalOpen(false); // Close Seller modal
    };

    const navigateToHome = () => {
        navigate("/"); // Redirect to the homepage
    };

    return (
        <>
            <nav className="navbar">
                {/* Logo Section */}
                <div className="navbar-logo" onClick={navigateToHome} style={{ cursor: "pointer" }}>
                    <span className="navbar-title">Book<span className="highlight">X</span>changer</span>
                </div>

                {/* Hamburger Icon for Mobile */}
                <div className="hamburger" onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>

                {/* Navigation Links */}
                <ul className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
                    <li><a onClick={navigateToHome} style={{ cursor: "pointer" }}>Home</a></li>
                    <li><Link to="/books">Books</Link></li>
                    <li><a href="/about">About Us</a></li>
                    <li>
                        <button className="btn btn-signup" onClick={openBuyerModal}>Buy Books</button>
                    </li>
                    <li>
                        <button className="btn btn-sell" onClick={openSellerModal}>Sell Books</button>
                    </li>
                </ul>
            </nav>

            {/* Render Modals */}
            <BuyerAuthModal isOpen={isBuyerModalOpen} onClose={closeBuyerModal} />
            <SellerAuthModal isOpen={isSellerModalOpen} onClose={closeSellerModal} />
        </>
    );
};

export default Navbar;
