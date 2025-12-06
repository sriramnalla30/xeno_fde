import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Add a request interceptor to include the tenant ID and auth token
api.interceptors.request.use((config) => {
    const tenantId = localStorage.getItem('tenant_id') || 'sriram-dev-studio';
    const token = localStorage.getItem('token');

    if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
    }
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (data) => api.post('/auth/register', data);

// Dashboard APIs
export const getStats = () => api.get('/dashboard/stats');
export const getRecentOrders = (params) => api.get('/dashboard/orders', { params });
export const getTopCustomers = (limit) => api.get('/dashboard/top-customers', { params: { limit } });
export const getOrdersByDate = (days) => api.get('/dashboard/orders-by-date', { params: { days } });
export const getOrdersByTime = (days) => api.get('/dashboard/orders-by-time', { params: { days } });
export const getProducts = () => api.get('/dashboard/products');
export const ingestData = () => api.post('/ingest');

export default api;
