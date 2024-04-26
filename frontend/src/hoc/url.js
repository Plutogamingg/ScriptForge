// config.js
let API_BASE_URL;

if (window.location.hostname === 'localhost') {
    API_BASE_URL = 'http://localhost:8000';
} else {
    API_BASE_URL = 'https://scriptforge-backend-aa91ce867da3.herokuapp.com';
}

export default API_BASE_URL;
