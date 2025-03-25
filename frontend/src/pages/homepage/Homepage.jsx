import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./Homepage.css";
import { getAllBooks } from "../../services/bookService";

const Home = () => {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate(); // ✅ hook for navigation

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await getAllBooks();
            setBooks(response.slice(0, 8)); // Limit to 6 books
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleViewAllBooks = () => {
        navigate("/books"); // ✅ redirect to /books
    };

    return (
        <div>
            <Navbar />
            <main className="home-container">
                {/* Hero Section */}
                <section className="hero">
                    <h1>📚 Exchange, Buy, and Rent Books with Ease</h1>
                    <p>
                        BookXchanger is your one-stop solution to give your books a second life.
                        Whether you’re a student looking to rent textbooks affordably, a reader
                        eager to explore new stories, or someone wanting to pass on unused books—
                        we make it easy, sustainable, and budget-friendly. Join our growing
                        community and discover the smarter way to exchange knowledge.
                    </p>
                </section>

                {/* Why Choose Us */}
                <section className="features">
                    <h2>💡 Why Choose Us?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>📚 Wide Range of Books</h3>
                            <p>Choose from thousands of titles across all genres and academic fields.</p>
                        </div>
                        <div className="feature-card">
                            <h3>🔄 Easy Renting & Buying</h3>
                            <p>Our platform is user-friendly, letting you rent, buy, or exchange in minutes.</p>
                        </div>
                        <div className="feature-card">
                            <h3>💸 Affordable Prices</h3>
                            <p>Buy or rent books at student-friendly prices with no hidden costs.</p>
                        </div>
                    </div>
                </section>

                {/* Explore Books */}
                <section className="explore-books">
                    <h2>📖 Explore Popular Books</h2>
                    <div className="books-grid">
                        {books.map((book) => (
                            <div className="book-card" key={book._id}>
                                <img src={book.images?.[0] || "/default-book.jpg"} alt={book.title} />
                                <h3>{book.title}</h3>
                                <p>📘 Branch: {book.genre}</p>
                                <p>₹{book.price || "N/A"}</p>
                                <p>Available For: {book.type === "rent" ? "Rental" : "Buy"}</p>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-view-all" onClick={handleViewAllBooks}>
                        View All Books
                    </button>
                </section>

                {/* How It Works */}
                <section className="how-it-works">
                    <h2>⚙️ How It Works</h2>
                    <div className="steps">
                        <div className="step">
                            <h3>📝 Step 1</h3>
                            <p>Create an account as a buyer or seller in seconds.</p>
                        </div>
                        <div className="step">
                            <h3>🔍 Step 2</h3>
                            <p>List your books or explore available ones on our platform.</p>
                        </div>
                        <div className="step">
                            <h3>✅ Step 3</h3>
                            <p>Connect, chat, and complete your order with ease.</p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
