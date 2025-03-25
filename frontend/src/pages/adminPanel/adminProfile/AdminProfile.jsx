import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/adminPanel/adminSidebar/AdminSidebar";
import { fetchAdminProfile, updateAdminPassword } from "../../../services/adminService";
import "./AdminProfile.css";

const AdminProfile = () => {
    const [admin, setAdmin] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchAdminProfile();
                setAdmin(data);
            } catch (err) {
                console.error("Error fetching profile", err);
            }
        };
        loadProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmin({ ...admin, [name]: value });
    };

    const handlePasswordUpdate = async () => {
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            alert("New passwords do not match.");
            return;
        }
        try {
            const res = await updateAdminPassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setMessage(res.message);
            setPasswords({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        } catch (err) {
            setMessage("Failed to update password");
            console.error(err);
        }
    };

    return (
        <div className="admin-profile-wrapper">
            <AdminSidebar />
            <div className="admin-profile-content">
                <div className="admin-profile-header">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="Admin"
                        className="admin-profile-pic"
                    />
                    <div>
                        <h2>{admin.name || "Admin"}</h2>
                        <p>Email: {admin.email}</p>
                        <p>ID: {admin._id}</p>
                    </div>
                </div>

                <div className="admin-profile-container">
                    {/* Change Password Card */}
                    <div className="admin-profile-card">
                        <h3>Change Password</h3>
                        <div className="admin-profile-grid">
                            <div>
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.currentPassword}
                                    onChange={(e) =>
                                        setPasswords({ ...passwords, currentPassword: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) =>
                                        setPasswords({ ...passwords, newPassword: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirmNewPassword}
                                    onChange={(e) =>
                                        setPasswords({ ...passwords, confirmNewPassword: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <button className="btn-secondary" onClick={handlePasswordUpdate}>
                            Update Password
                        </button>
                        {message && <p className="admin-profile-message">{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
