import { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/adminPanel/adminSidebar/AdminSidebar';
import { getAllBuyers, toggleBuyerStatus } from '../../../services/adminService';
import './ManageBuyers.css';

const ManageBuyers = () => {
    const [buyers, setBuyers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBuyers = async () => {
            try {
                const data = await getAllBuyers();
                setBuyers(data);
            } catch (error) {
                console.error("Error fetching buyers:", error);
            }
        };
        fetchBuyers();
    }, []);

    const handleToggle = async (id) => {
        try {
            const res = await toggleBuyerStatus(id);
            const updatedBuyers = buyers.map((b) =>
                b._id === id ? { ...b, status: b.status === "blocked" ? "active" : "blocked" } : b
            );
            setBuyers(updatedBuyers);
        } catch (error) {
            console.error("Error toggling buyer status:", error);
        }
    };
    

    const filtered = buyers.filter(
        (b) =>
            b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-manage-buyers-wrapper">
            <AdminSidebar />
            <div className="admin-manage-buyers-content">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-manage-buyers-search"
                />

                <div className="admin-buyers-table-wrapper">
                    <table className="admin-buyers-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                {/* <th>Branch</th> */}
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map((b) => (
                                    <tr key={b._id}>
                                        <td>{b.name}</td>
                                        <td>{b.email}</td>
                                        {/* <td>{b.branch || 'N/A'}</td> */}
                                        <td>{b.status}</td>
                                        <td>
                                            <button
                                                className={
                                                    b.status === 'blocked'
                                                        ? 'admin-buyers-unblock-btn'
                                                        : 'admin-buyers-block-btn'
                                                }
                                                onClick={() => handleToggle(b._id)}
                                            >
                                                {b.status === 'blocked' ? 'Unblock' : 'Block'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="admin-buyers-empty-msg">
                                        No buyers found.
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

export default ManageBuyers;
