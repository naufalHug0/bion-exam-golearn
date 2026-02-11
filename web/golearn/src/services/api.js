import axios from 'axios';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`
});

API.interceptors.request.use((req) => {
    const user = localStorage.getItem('user_storage');
    if (user) {
        const { state } = JSON.parse(user);
        if (state.token) {
        req.headers.Authorization = `Bearer ${state.token}`;
        }
    }
    return req;
});

export const getFileUrl = (path) => {
    return `${import.meta.env.VITE_API_URL}/${path}`
};

export default API;