import { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/adminPanel/adminSidebar/AdminSidebar';
import { getAllSellers, toggleSellerStatus } from '../../../services/adminService';
import './ManageSellers.css';

const ManageSellers = () => {
    const [sellers, setSellers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchSellers = async () => {
        const data = await getAllSellers();
        setSellers(data);
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    const handleToggle = async (id) => {
        await toggleSellerStatus(id);
        fetchSellers();
    };

    const filtered = sellers.filter(
        (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-manage-sellers-wrapper">
            <AdminSidebar />
            <div className="admin-manage-sellers-content">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-manage-sellers-search"
                />

                <div className="admin-sellers-table-wrapper">
                    <table className="admin-sellers-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map((seller) => (
                                    <tr key={seller._id}>
                                        <td>{seller.name}</td>
                                        <td>{seller.email}</td>
                                        <td>{seller.phone || 'N/A'}</td>
                                        <td>{seller.status}</td>
                                        <td>
                                            <button
                                                className={
                                                    seller.status === 'blocked'
                                                        ? 'admin-seller-unblock-btn'
                                                        : 'admin-seller-block-btn'
                                                }
                                                onClick={() => handleToggle(seller._id)}
                                            >
                                                {seller.status === 'blocked' ? 'Unblock' : 'Block'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="admin-sellers-empty-msg">
                                        No sellers found.
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

export default ManageSellers;
