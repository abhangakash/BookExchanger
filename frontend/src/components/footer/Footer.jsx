import React, { useState } from "react";
import "./Footer.css";
import BuyerAuthModal from "../BuyerAuthModal/BuyerAuthModal";
import SellerAuthModal from "../SellerAuthModal/SellerAuthModal";

const Footer = () => {
    const [isBuyerModalOpen, setIsBuyerModalOpen] = useState(false);
    const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);

    const openBuyerModal = () => setIsBuyerModalOpen(true);
    const closeBuyerModal = () => setIsBuyerModalOpen(false);

    const openSellerModal = () => setIsSellerModalOpen(true);
    const closeSellerModal = () => setIsSellerModalOpen(false);

    return (
        <>
            <footer className="footer">
                <div className="footer-container">
                    {/* Logo and Tagline */}
                    <div className="footer-logo">
                        <h2>Book<span className="highlight">X</span>changer</h2>
                        <p>Best Recycle is Book Recycle.</p>
                    </div>

                    {/* Social Media Links */}
                    <div className="footer-social">
                        <h3>Get in Touch</h3>
                        <div className="social-icons">
                            <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                            <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
                            <a href="mailto:support@bookxchanger.com" aria-label="Email"><i className="fas fa-envelope"></i></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/books">Books</a></li>
                            <li><a href="/about">About Us</a></li>
                            <li>
                                <button className="footer-link-button" onClick={openSellerModal}>
                                    Sell Books
                                </button>
                            </li>
                            <li>
                                <button className="footer-link-button" onClick={openBuyerModal}>
                                    Buy Books
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>

            {/* Modals */}
            <BuyerAuthModal isOpen={isBuyerModalOpen} onClose={closeBuyerModal} />
            <SellerAuthModal isOpen={isSellerModalOpen} onClose={closeSellerModal} />
        </>
    );
};

export default Footer;
