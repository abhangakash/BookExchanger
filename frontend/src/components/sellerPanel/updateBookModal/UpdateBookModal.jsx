import React, { useState, useEffect } from "react";
import "./UpdateBookModal.css";
import { updateBook, getBranches } from "../../../services/bookService";

const UpdateBookModal = ({ book, onClose, onUpdateSuccess }) => {
    const [branches, setBranches] = useState([]);
    const [formData, setFormData] = useState({
        bookType: book.bookType || "new",
        title: book.title || "",
        author: book.author || "",
        branch: book.branch || "",
        original_price: book.original_price || book.price || book.customPrice || book.predictedPrice || "",
        rentPrice: book.rentPrice || "",
        isRentable: book.isRentable || false,
        condition: book.condition || "good",
        publicationDate: book.publicationDate ? book.publicationDate.split("T")[0] : "",  // ✅ Convert Date properly
        description: book.description || "", // ✅ Ensure description is set
        images: book.images || [],
        newImages: [],
    });
    

    // ✅ Fetch Branches from Backend (same as AddBookModal)
    useEffect(() => {
        const fetchBranches = async () => {
            const data = await getBranches();
            setBranches(data);
        };

        fetchBranches();
    }, []);

    // ✅ Handle Input Change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // ✅ Handle Image Upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length + formData.newImages.length > 5) {
            alert("You can upload a maximum of 5 images.");
            return;
        }
        setFormData((prevState) => ({
            ...prevState,
            newImages: [...prevState.newImages, ...files], // Store new images
        }));
    };

    // ✅ Remove Image (Existing or New)
    const removeImage = (index, isNew = false) => {
        if (isNew) {
            const newImages = [...formData.newImages];
            newImages.splice(index, 1);
            setFormData({ ...formData, newImages });
        } else {
            const existingImages = [...formData.images];
            existingImages.splice(index, 1);
            setFormData({ ...formData, images: existingImages });
        }
    };

    // ✅ Handle Book Update
    const handleUpdate = async (e) => {
        e.preventDefault();
    
        try {
            const updatedData = new FormData();
    
            // ✅ Ensure all fields are properly appended
            updatedData.append("title", formData.title.trim());
            updatedData.append("author", formData.author.trim());
            updatedData.append("branch", formData.branch.trim());
            updatedData.append("original_price", formData.original_price);
            updatedData.append("condition", formData.condition);
            updatedData.append("isRentable", formData.isRentable.toString());
            updatedData.append("publicationDate", formData.publicationDate || "");
    
            // ✅ Append Rent Price if book is rentable
            if (formData.isRentable && formData.rentPrice) {
                updatedData.append("rentPrice", formData.rentPrice);
            }
    
            // ✅ Append Images if new images are uploaded
            if (formData.newImages.length > 0) {
                formData.newImages.forEach((file) => {
                    updatedData.append("images", file); // ✅ Append new images correctly
                });
            }
    
            // ✅ Debug: Log FormData before sending request
            console.log("📤 Sending FormData:");
            for (let pair of updatedData.entries()) {
                console.log(pair[0], pair[1]);
            }
    
            // ✅ Send the updated book data to the backend
            await updateBook(book._id, updatedData);
            alert("✅ Book Updated Successfully!");
            onUpdateSuccess();
            onClose();
        } catch (error) {
            console.error("❌ Error updating book:", error);
            alert("❌ Failed to update book.");
        }
    };
    




    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Update Book</h3>
                <form onSubmit={handleUpdate}>
                    {/* ✅ Book Type (Readonly) */}
                    <label>Book Type</label>
                    <input type="text" name="bookType" value={formData.bookType} readOnly />

                    <div className="form-grid">
                        <div>
                            <label>Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                        </div>

                        <div>
                            <label>Author</label>
                            <input type="text" name="author" value={formData.author} onChange={handleChange} required />
                        </div>

                        <div>
                            <label>Branch</label>
                            <select name="branch" value={formData.branch} onChange={handleChange} required>
                                <option value="" disabled>Select Branch</option>
                                {branches.map((branch) => (
                                    <option key={branch} value={branch}>
                                        {branch}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Price (₹)</label>
                            <input type="number" name="original_price" value={formData.original_price} onChange={handleChange} required />
                        </div>
                    </div>

                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange}></textarea>

                    {/* ✅ Existing Images Preview */}
                    <label>Existing Images</label>
                    <div className="image-preview">
                        {formData.images.map((img, index) => (
                            <div key={index} className="image-item">
                                <img src={img} alt="Existing Preview" />
                                <button type="button" onClick={() => removeImage(index)}>X</button>
                            </div>
                        ))}
                    </div>

                    {/* ✅ Upload New Images */}
                    <label>Upload New Images (Max 5)</label>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

                    <div className="image-preview">
                        {formData.newImages.map((img, index) => (
                            <div key={index} className="image-item">
                                <img src={URL.createObjectURL(img)} alt="New Preview" />
                                <button type="button" onClick={() => removeImage(index, true)}>X</button>
                            </div>
                        ))}
                    </div>

                    {/* ✅ Is Rentable Checkbox */}
                    <label className="checkbox-label">
                        <input type="checkbox" name="isRentable" checked={formData.isRentable} onChange={handleChange} />
                        Is Rentable?
                    </label>

                    {/* ✅ Show Rent Price Field Only If Rentable */}
                    {formData.isRentable && (
                        <>
                            <label>Rent Price (₹)</label>
                            <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} />
                        </>
                    )}

                    <div className="form-grid">
                        <div>
                            <label>Condition</label>
                            <select name="condition" value={formData.condition} onChange={handleChange}>
                                <option value="new">New</option>
                                <option value="good">Good</option>
                                <option value="average">Average</option>
                                <option value="poor">Poor</option>
                            </select>
                        </div>
                        <div>
                            <label>Publication Date</label>
                            <input type="date" name="publicationDate" value={formData.publicationDate} onChange={handleChange} />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary">Update Book</button>
                    <button type="button" className="btn-close" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateBookModal;
