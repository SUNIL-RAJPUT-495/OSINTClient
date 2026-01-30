import axios from "axios";
import { baseURL } from "../common/SummeryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true // Cookies support (PC/Laptop ke liye)
});

// --- INTERCEPTOR (MOBILE MAGIC FIX) ---
// Har request bhejne se pehle ye function chalega
Axios.interceptors.request.use(
    (config) => {
        // 1. LocalStorage se token nikalo
        const token = localStorage.getItem("access_token");

        // 2. Agar token mila, toh Header mein daal do
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default Axios;