import api from './apiConfig';

// Auth
export const adminLogin = async (data) => {
    const response = await api.post('/admin/login', data);
    if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
    }
    return response.data;
};

// Profile
export const fetchAdminProfile = async () => {
    const response = await api.get('/admin/profile');
    return response.data;
};

export const updateAdminPassword = async (data) => {
    const response = await api.put('/admin/password', data);
    return response.data;
};

// Buyers
export const getAllBuyers = async () => {
    const response = await api.get('/admin/buyers');
    return response.data;
};

export const toggleBuyerStatus = async (id) => {
    const response = await api.put(`/admin/buyers/${id}/toggle-status`);
    return response.data;
};

// Sellers
export const getAllSellers = async () => {
    const response = await api.get('/admin/sellers');
    return response.data;
};

export const toggleSellerStatus = async (id) => {
    const response = await api.put(`/admin/sellers/${id}/toggle-status`);
    return response.data;
};

// Books
export const getAllBooks = async () => {
    const response = await api.get('/admin/books');
    return response.data;
};

export const deleteBook = async (bookId) => {
    const response = await api.delete(`/admin/books/${bookId}`);
    return response.data;
};

// Orders
export const getAllOrders = async () => {
    const response = await api.get('/admin/orders');
    return response.data;
};

// Stats
export const getDashboardStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};
