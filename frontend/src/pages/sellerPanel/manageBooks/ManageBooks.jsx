import React, { useState, useEffect } from "react";
import "./ManageBooks.css";
import { getBooksBySeller, deleteBook } from "../../../services/bookService";
import { FaTrash, FaEdit } from "react-icons/fa";
import UpdateBookModal from "../../../components/sellerPanel/updateBookModal/UpdateBookModal"; // Import UpdateBookModal

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [editBook, setEditBook] = useState(null); // Holds book to be edited

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await getBooksBySeller();
            setBooks(response);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;

        try {
            await deleteBook(id);
            setBooks(books.filter((book) => book._id !== id));
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    const handleEditClick = (book) => {
        setEditBook(book); // Open update modal with selected book
    };

    return (
        <div className="manage-books-container">
            <h2>Manage Books</h2>

            {/* Books Table */}
            <table className="books-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Book Type</th>  {/* ✅ Added Book Type */}
                        <th>Branch</th> {/* ✅ Changed Genre to Branch */}
                        <th>Original Price (₹)</th> {/* ✅ Changed Price to Original Price */}
                        <th>Predicted Price (₹)</th> {/* ✅ Added Predicted Price */}
                        <th>Rent Price (₹)</th>
                        <th>Condition</th>
                        <th>Rentable</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {books.length > 0 ? (
                        books.map((book) => (
                            book && ( // ✅ Ensure `book` exists before rendering
                                <tr key={book._id}>
                                    <td>{book.title || "N/A"}</td>
                                    <td>{book.author || "N/A"}</td>
                                    <td>
                                        {book.bookType ? 
                                            book.bookType.charAt(0).toUpperCase() + book.bookType.slice(1) 
                                            : "N/A"} {/* ✅ Fix charAt() Error */}
                                    </td>
                                    <td>{book.branch || "N/A"}</td> {/* ✅ Show Branch */}
                                    <td>₹{book.original_price ?? "N/A"}</td> {/* ✅ Show Original Price */}
                                    <td>₹{book.predictedPrice ?? "N/A"}</td> {/* ✅ Show Predicted Price */}
                                    <td>{book.rentPrice ? `₹${book.rentPrice}` : "N/A"}</td>
                                    <td>{book.condition || "N/A"}</td>
                                    <td>{book.isRentable ? "Yes" : "No"}</td>
                                    <td className="action-buttons">
                                        <button className="edit-btn" onClick={() => handleEditClick(book)}>
                                            <FaEdit />
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(book._id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            )
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">No books found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Update Book Modal */}
            {editBook && (
                <UpdateBookModal
                    book={editBook}
                    onClose={() => setEditBook(null)}
                    onUpdateSuccess={fetchBooks} // Refresh book list after update
                />
            )}
        </div>
    );
};

export default ManageBooks;
