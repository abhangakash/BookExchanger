import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public Pages
import Homepage from "./pages/homepage/Homepage";
import Books from "./pages/books/Books";
import AboutUs from "./pages/about/AboutUs";

// Buyer Panel
import BuyerDashboard from "./pages/buyerPanel/buyerDashboard/BuyerDashboard";
import ProductPage from "./pages/buyerPanel/productPage/ProductPage";
import BuyerNavbar from "./pages/buyerPanel/buyerNavbar/BuyerNavbar";
import MyOrders from "./pages/buyerPanel/myOrders/MyOrders";
import BuyerProfile from "./pages/buyerPanel/profile/Profile";
import BuyerChats from "./pages/buyerPanel/chats/BuyerChats";

// Seller Panel
import SellerDashboard from "./pages/sellerPanel/dashBoard/Dashboard";
import ManageBooks from "./pages/sellerPanel/manageBooks/ManageBooks";
import Orders from "./pages/sellerPanel/orders/Orders";
import Reports from "./pages/sellerPanel/reports/Reports";
import Profile from "./pages/sellerPanel/profile/Profile";
import SellerSidebar from "./components/sellerPanel/sellerSidebar/SellerSidebar";
import SellerChats from "./pages/sellerPanel/chats/SellerChats";

// Admin Panel
import AdminLogin from "./pages/adminPanel/adminLogin/AdminLogin";
import AdminDashboard from "./pages/adminPanel/admindashboard/AdminDashboard";
import AdminSidebar from "./components/adminPanel/adminSidebar/AdminSidebar";
import AdminProfile from "./pages/adminPanel/adminProfile/AdminProfile";
import ManageBuyers from "./pages/adminPanel/manageBuyers/ManageBuyers";
import ManageSellers from "./pages/adminPanel/manageSellers/ManageSellers";
import ManageBooksAdmin from "./pages/adminPanel/manageBooks/ManageBooks"; // renamed to avoid conflict
import ManageOrders from "./pages/adminPanel/manageOrders/ManageOrders";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/books" element={<BuyerDashboard />} />
                <Route path="/about" element={<AboutUs />} />

                {/* Buyer Panel */}
                <Route
                    path="/buyer/*"
                    element={
                        <div className="buyer-panel-container">
                            <BuyerNavbar />
                            <div className="buyer-content">
                                <Routes>
                                    <Route path="dashboard" element={<BuyerDashboard />} />
                                    <Route path="book/:bookId" element={<ProductPage />} />
                                    <Route path="orders" element={<MyOrders />} />
                                    <Route path="profile" element={<BuyerProfile />} />
                                    <Route path="chats" element={<BuyerChats />} />
                                </Routes>
                            </div>
                        </div>
                    }
                />

                {/* Seller Panel */}
                <Route
                    path="/seller/*"
                    element={
                        <div className="seller-panel-container">
                            <SellerSidebar />
                            <div className="seller-content">
                                <Routes>
                                    <Route path="dashboard" element={<SellerDashboard />} />
                                    <Route path="manage-books" element={<ManageBooks />} />
                                    <Route path="orders" element={<Orders />} />
                                    <Route path="reports" element={<Reports />} />
                                    <Route path="profile" element={<Profile />} />
                                    <Route path="chats" element={<SellerChats />} />
                                </Routes>
                            </div>
                        </div>
                    }
                />

                {/* Admin Login Page */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Panel Routes */}
                <Route
                    path="/admin/*"
                    element={
                        <div className="admin-panel-container">
                            <AdminSidebar />
                            <div className="admin-content">
                                <Routes>
                                    <Route path="dashboard" element={<AdminDashboard />} />
                                    <Route path="profile" element={<AdminProfile />} />
                                    <Route path="buyers" element={<ManageBuyers />} />
                                    <Route path="sellers" element={<ManageSellers />} />
                                    <Route path="books" element={<ManageBooksAdmin />} />
                                    <Route path="orders" element={<ManageOrders />} />
                                </Routes>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
