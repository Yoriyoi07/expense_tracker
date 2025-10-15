import axios from 'axios';

// If REACT_APP_API_URL is provided, use it; otherwise rely on CRA proxy during development
const baseURL = process.env.REACT_APP_API_URL || undefined;
const api = axios.create({ baseURL });

export const listTransactions = (params = {}) => api.get('/api/transactions', { params }).then(r => r.data);
export const createTransaction = (data) => api.post('/api/transactions', data).then(r => r.data);
export const updateTransaction = (id, data) => api.put(`/api/transactions/${id}`, data).then(r => r.data);
export const deleteTransaction = (id) => api.delete(`/api/transactions/${id}`).then(r => r.data);

export default api;
