import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../../../services/bookService";
import "./BuyerDashboard.css";

const BuyerDashboard = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("all"); // ⬅️ New state for branch filter
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getAllBooks();
                setBooks(data || []);
            } catch (error) {
                console.error("Error fetching books:", error);
                setBooks([]);
            }
        };
        fetchBooks();
    }, []);

    const handleBookClick = (bookId) => {
        navigate(`/buyer/book/${bookId}`);
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    // ✅ Extract branches for dropdown
    const uniqueBranches = [
        ...new Set(
            books
                .map(book => book.branch)
                .filter(branch => branch && branch.trim() !== "")
        ),
    ];
    


    // ✅ Apply search + branch filtering
    const filteredBooks = books.filter((book) => {
        const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || book.author.toLowerCase().includes(search.toLowerCase());
        const matchesBranch = selectedBranch === "all" || book.branch === selectedBranch;
        return matchesSearch && matchesBranch;
    });

    const recommendedBooks = filteredBooks.filter(book => book.recommendations?.length > 0);
    const bestsellers = filteredBooks.filter(book => book.ratings?.average >= 4);
    const booksByBranch = filteredBooks.reduce((acc, book) => {
        if (!acc[book.branch]) acc[book.branch] = [];
        acc[book.branch].push(book);
        return acc;
    }, {});

    return (
        <div className="buyer-dashboard">
            <h2>Explore Books</h2>

            {/* 🔍 Search + Filter Bar */}
            <div className="search-filter-row">
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-bar"
                />
                <select
                    className="branch-filter"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                >
                    <option value="all">All Branches</option>
                    {uniqueBranches.map((branch, index) => (
                        <option key={index} value={branch}>{branch}</option>
                    ))}
                </select>
            </div>

            {filteredBooks.length === 0 ? (
                <p>No books found.</p>
            ) : (
                <>
                    {recommendedBooks.length > 0 && (
                        <div>
                            <h3>Recommended Books</h3>
                            <div className="book-grid">
                                {recommendedBooks.map((book) => (
                                    <div key={book._id} className="book-card" onClick={() => handleBookClick(book._id)}>
                                        <img src={book.images?.[0] || "default-book.jpg"} alt={book.title} />
                                        <h3>{truncateText(book.title, 20)}</h3>
                                        <p><strong>Author:</strong> {truncateText(book.author, 18)}</p>
                                        <p><strong>Price:</strong> ₹{book.original_price}</p>
                                        <p><strong>Rent Price:</strong> {book.rentPrice ? `₹${book.rentPrice}` : "Not Available"}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {bestsellers.length > 0 && (
                        <div>
                            <h3>Bestsellers</h3>
                            <div className="book-grid">
                                {bestsellers.map((book) => (
                                    <div key={book._id} className="book-card" onClick={() => handleBookClick(book._id)}>
                                        <img src={book.images?.[0] || "default-book.jpg"} alt={book.title} />
                                        <h3>{truncateText(book.title, 20)}</h3>
                                        <p><strong>Author:</strong> {truncateText(book.author, 18)}</p>
                                        <p><strong>Price:</strong> ₹{book.original_price}</p>
                                        <p><strong>Rating:</strong> ⭐{book.ratings.average.toFixed(1)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {Object.keys(booksByBranch).map((branch) => (
                        booksByBranch[branch].length > 0 && (
                            <div key={branch}>
                                <h3>{branch} Books</h3>
                                <div className="book-grid">
                                    {booksByBranch[branch].map((book) => (
                                        <div key={book._id} className="book-card" onClick={() => handleBookClick(book._id)}>
                                            <img src={book.images?.[0] || "default-book.jpg"} alt={book.title} />
                                            <h3>{truncateText(book.title, 20)}</h3>
                                            <p><strong>Author:</strong> {truncateText(book.author, 18)}</p>
                                            <p><strong>Price:</strong> ₹{book.original_price}</p>
                                            <p><strong>Condition:</strong> {book.condition}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </>
            )}
        </div>
    );
};

export default BuyerDashboard;
