import axios from "axios";
import { storageService } from "../services/storageService.js";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        Accept: "application/json",
    }
})

api.interceptors.request.use((config) => {
    const token = storageService.getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
export default api