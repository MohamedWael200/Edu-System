
import axios from "axios";
import { storageService } from "../services/storageService.js";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        Accept: "application/json",
    },
});

// Request Interceptor
api.interceptors.request.use((config) => {
    const token = storageService.getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response Interceptor
api.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url || "";

        // Handle expired or invalid authentication
        if (
            status === 401 &&
            !requestUrl.includes("/auth/login")
        ) {
            storageService.removeToken();

            window.dispatchEvent(
                new Event("auth:unauthorized")
            );
        }

        return Promise.reject(error);
    }
);

export default api;
