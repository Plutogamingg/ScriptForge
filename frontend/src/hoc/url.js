// api-config.js
import axios from "axios";

// Determine the API base URL based on the environment
let API_BASE_URL;
if (window.location.hostname === 'localhost') {
    API_BASE_URL = 'http://localhost:8000/api/';
} else {
    API_BASE_URL = 'https://scriptforge-backend-aa91ce867da3.herokuapp.com/api/';
}

// Create a generic Axios instance for public requests
export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Create a specialized Axios instance for private requests that might need different interceptors
export const axiosPrivateInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

