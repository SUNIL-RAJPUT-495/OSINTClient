import axios from "axios";
import { baseURL } from "../common/SummeryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true 
});

Axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

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