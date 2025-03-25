import React, { useState, useEffect } from "react";
import { useParams,Link } from "react-router-dom";
import { getBookById, getSimilarBooks } from "../../../services/bookService";
import { startChatWithSeller } from "../../../services/chatService";
import BuyerChatWindow from "../chats/BuyerChatModal";
import BuyerAuthModal from "../../../components/BuyerAuthModal/BuyerAuthModal";
import "./ProductPage.css";

const ProductPage = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [similarBooks, setSimilarBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chat, setChat] = useState(null);
    const [showChatModal, setShowChatModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const isLoggedIn = !!localStorage.getItem("token"); // Check login

    useEffect(() => {
        if (!bookId) {
            console.error("No book ID provided");
            setLoading(false);
            return;
        }

        const fetchBookDetails = async () => {
            try {
                const bookData = await getBookById(bookId);
                setBook(bookData);
                setSelectedImage(bookData.images?.[0] || "/default-book.jpg");

                const similarBooksData = await getSimilarBooks(bookId);
                setSimilarBooks(similarBooksData);
            } catch (error) {
                console.error("Error fetching book details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [bookId]);

    const handleStartChat = async () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        if (!book || !book._id || !book.seller) {
            console.error("Book or Seller data missing.");
            return;
        }

        try {
            const response = await startChatWithSeller(book._id, book.seller._id);
            if (response?.chat) {
                setChat(response.chat);
                setShowChatModal(true);
            }
        } catch (error) {
            console.error("Error starting chat:", error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!book) return <p>Book not found.</p>;

    return (
        <div className="product-page">
            <div className="product-container">
                <div className="image-section">
                    <div className="thumbnail-list">
                        {book.images?.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Book preview ${index + 1}`}
                                className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                    <img className="main-image" src={selectedImage} alt={book.title} />
                </div>

                <div className="details-section">
                    <h2>{book.title}</h2>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Book Type:</strong> {book.bookType}</p>
                    <p><strong>Branch:</strong> {book.branch}</p>
                    <p><strong>Condition:</strong> {book.condition}</p>
                    <p><strong>Pages:</strong> {book.pages || "N/A"}</p>
                    <p><strong>Publication Date:</strong> {book.publicationDate ? new Date(book.publicationDate).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Price:</strong> ₹{book.original_price}</p>
                    <p><strong>Predicted Price:</strong> ₹{book.predictedPrice || "N/A"}</p>
                    <p><strong>Rent Price:</strong> {book.isRentable ? `₹${book.rentPrice}` : "Not Available"}</p>
                    <p><strong>Seller:</strong> {book.seller?.name || "Unknown"}</p>
                    <p><strong>Description:</strong> {book.description || "No description available."}</p>

                    <div className="action-buttons">
                        <button className="chat-with-seller" onClick={handleStartChat}>
                            Chat with Seller
                        </button>
                    </div>
                </div>
            </div>

            <div className="similar-books">
                <h3>Similar Books</h3>
                <div className="scroll-container">
                {similarBooks.length > 0 ? (
    similarBooks.map((sBook) => (
        <Link
            to={`/buyer/book/${sBook._id}`}
            key={sBook._id}
            className="similar-card-link"
        >
            <div className="similar-card">
                <img src={sBook.images?.[0] || "/default-book.jpg"} alt={sBook.title} />
                <p>{sBook.title.length > 20 ? sBook.title.substring(0, 20) + "..." : sBook.title}</p>
                <p><strong>₹{sBook.original_price}</strong></p>
            </div>
        </Link>
    ))
) : (
    <p>No similar books found.</p>
)}
                </div>
            </div>

            {/* Buyer Chat Modal */}
            {showChatModal && chat && (
                <div className="buyer-chat-modal">
                    <div className="buyer-chat-modal-overlay" onClick={() => setShowChatModal(false)}></div>
                    <div className="buyer-chat-modal-content">
                        <button className="chat-modal-close" onClick={() => setShowChatModal(false)}>X</button>
                        <BuyerChatWindow chatId={chat._id} onClose={() => setShowChatModal(false)} />
                    </div>
                </div>
            )}

            {/* Buyer Auth Modal */}
            <BuyerAuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
};

export default ProductPage;
