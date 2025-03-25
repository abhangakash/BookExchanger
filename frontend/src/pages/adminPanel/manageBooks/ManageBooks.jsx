import { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/adminPanel/adminSidebar/AdminSidebar';
import { getAllBooks, deleteBook } from '../../../services/adminService';
import './ManageBooks.css';

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');

    const fetchBooks = async () => {
        try {
            const data = await getAllBooks();
            setBooks(data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        try {
            await deleteBook(id);
            fetchBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    const filteredBooks = books.filter((book) =>
        book.title?.toLowerCase().includes(search.toLowerCase()) ||
        book.branch?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="admin-manage-books-wrapper">
            <AdminSidebar />
            <div className="admin-manage-books-content">
                {/* <h2 className="admin-manage-books-title">📚 Manage Books</h2> */}
                <input
                    type="text"
                    placeholder="Search by title or branch"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="admin-manage-books-search"
                />

                <div className="admin-books-table-wrapper">
                    <table className="admin-books-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Type</th>
                                <th>Branch</th>
                                <th>Original Price</th>
                                <th>Predicted Price</th>
                                <th>Current Price</th>
                                <th>Rent Price</th>
                                <th>Condition</th>
                                <th>Rentable</th>
                                <th>Seller</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredBooks.length > 0 ? (
                                filteredBooks.map((book) => (
                                    <tr key={book._id}>
                                        <td>{book.title || 'N/A'}</td>
                                        <td>{book.author || 'N/A'}</td>
                                        <td>{book.bookType || 'N/A'}</td>
                                        <td>{book.branch || 'N/A'}</td>
                                        <td>₹{book.original_price ?? 'N/A'}</td>
                                        <td>₹{book.predictedPrice ?? 'N/A'}</td>
                                        <td>₹{book.price ?? 'N/A'}</td>
                                        <td>₹{book.rentPrice ?? 'N/A'}</td>
                                        <td>{book.condition || 'N/A'}</td>
                                        <td>{book.isRentable ? 'Yes' : 'No'}</td>
                                        <td>{book.seller?.name || 'N/A'}</td>
                                        <td>
                                            <button
                                                className="admin-books-delete-btn"
                                                onClick={() => handleDelete(book._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="12" className="admin-books-empty-msg">
                                        No books found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageBooks;
