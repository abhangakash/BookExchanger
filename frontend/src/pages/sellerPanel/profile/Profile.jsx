import React, { useState, useEffect } from "react";
import "./Profile.css";
import { getSellerProfile, updateSellerProfile, changeSellerPassword, deleteSellerAccount } from "../../../services/profileService";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [passwords, setPasswords] = useState({ password: "", newPassword: "", confirmNewPassword: "" });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await getSellerProfile();
            setProfile(response);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile({ ...profile, [name]: type === "checkbox" ? checked : value });
    };

    const handleProfileUpdate = async () => {
        try {
            await updateSellerProfile(profile);
            alert("Profile updated successfully!");
            setIsEditing(false);
            fetchProfile(); // ✅ Fetch updated profile after updating
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };
    

    const handlePasswordChange = async () => {
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            alert("New passwords do not match!");
            return;
        }
        try {
            await changeSellerPassword({ password: passwords.password, newPassword: passwords.newPassword });
            alert("Password updated successfully!");
            setPasswords({ password: "", newPassword: "", confirmNewPassword: "" });
        } catch (error) {
            console.error("Error updating password:", error);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            try {
                await deleteSellerAccount();
                alert("Account deleted!");
            } catch (error) {
                console.error("Error deleting account:", error);
            }
        }
    };

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className="seller-profile">
            {/* Profile Header */}
            <div className="profile-header">
                <img src={profile.profilePic || "https://i.etsystatic.com/22530935/r/il/e12dc2/2212316290/il_600x600.2212316290_dso3.jpg"} alt="Profile" className="profile-pic" />
                <div>
                    <h2>{profile.name}</h2>
                    <p>Joined on: {new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="profile-container">
                {/* Card 1 - Seller Information */}
                <div className="profile-card">
                    <h3>Seller Information</h3>
                    <div className="profile-grid">
                        <div>
                            <label>Name</label>
                            <input type="text" name="name" value={profile.name} onChange={handleInputChange} disabled={!isEditing} />
                        </div>
                        <div>
                            <label>Email</label>
                            <input type="email" name="email" value={profile.email} disabled />
                        </div>
                        <div>
                            <label>Phone</label>
                            <input type="text" name="phone" value={profile.phone} onChange={handleInputChange} disabled={!isEditing} />
                        </div>
                        <div>
                            <label>Shop Name</label>
                            <input type="text" name="shopName" value={profile.shopName} onChange={handleInputChange} disabled={!isEditing} />
                        </div>
                        <div>
                            <label>Shop Address</label>
                            <input type="text" name="shopAddress" value={profile.shopAddress} onChange={handleInputChange} disabled={!isEditing} />
                        </div>
                        <div>
                            <label>Seller Type</label>
                            <select name="sellerType" value={profile.sellerType} onChange={handleInputChange} disabled={!isEditing}>
                                <option value="shop owner">Shop Owner</option>
                                <option value="student">Student</option>
                            </select>
                        </div>
                    </div>
                    <button className="btn-primary" onClick={() => setIsEditing(!isEditing)}>
    {isEditing ? "Cancel" : "Edit Profile"}
</button>

{isEditing && (
    <button className="btn-secondary" onClick={handleProfileUpdate}>
        Update Profile
    </button>
)}

                </div>

                {/* Card 2 - Change Password */}
                <div className="profile-card">
                    <h3>Change Password</h3>
                    <div className="profile-grid">
                        <div>
                            <label>Current Password</label>
                            <input type="password" name="password" placeholder="Current Password" onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} />
                        </div>
                        <div>
                            <label>New Password</label>
                            <input type="password" name="newPassword" placeholder="New Password" onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
                        </div>
                        <div>
                            <label>Confirm New Password</label>
                            <input type="password" name="confirmNewPassword" placeholder="Confirm New Password" onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })} />
                        </div>
                    </div>
                    <button className="btn-secondary" onClick={handlePasswordChange}>Update Password</button>
                </div>

                

                {/* Card 4 - Danger Zone */}
                <div className="profile-card danger">
                    <h3>Danger Zone</h3>
                    <button className="btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
