import axios from "axios";

// Function to determine the API base URL based on the current environment
const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost') {
        return 'http://localhost:8000/api/';
    } else {
        return 'https://scriptforge-backend-aa91ce867da3.herokuapp.com/api/';
    }
};

// Base URL for all Axios instances
const API_BASE_URL = getApiBaseUrl();

// Function to create a configured Axios instance
const createAxios = () => {
    return axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    });
};

// Generic Axios instance for public API requests
export const axiosAny = createAxios();

// Specialized Axios instance for private API requests
// Additional interceptors or configurations can be added here if needed
export const axiosSecure = createAxios();

