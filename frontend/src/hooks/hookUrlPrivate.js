import { useEffect, useRef } from 'react';
import useAuthUser from './hookAuth';
import useRefreshToken from './hookRefresh';
import { axiosSecure } from '../hoc/url';

/**
 * Enhances an Axios instance with authentication and CSRF token management.
 * Automatically handles token refresh on token expiry and re-attempts failed requests.
 *
 * @returns {AxiosInstance} Axios instance configured with interceptors for token management.
 */
export default function useAxiosSecure() {
    const { accessToken, setAccessToken, csrftoken, setCSRFToken } = useAuthUser();
    const refresh = useRefreshToken();
    const requestQueue = useRef([]);
    const isRefreshing = useRef(false);

    // Function to add authorization and CSRF tokens to headers
    const addTokensToConfig = (config) => {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        config.headers['X-CSRFToken'] = csrftoken;
        return config;
    };

    // Handle response errors, particularly for token management
    const handleResponseError = async (error) => {
        const { config, response } = error;
        if (response && (response.status === 403 || response.status === 401) && !config.sent) {
            if (!isRefreshing.current) {
                return initiateTokenRefresh(config);
            }
            return queueFailedRequest(config);
        }
        return Promise.reject(error);
    };

    // Initiate token refresh and retry queued requests
    const initiateTokenRefresh = async (config) => {
        config.sent = true;  // Mark the request to avoid infinite loops
        isRefreshing.current = true;
        try {
            const tokens = await refresh();
            updateTokens(tokens);
            retryQueuedRequests();
        } catch (error) {
            console.error('Failed to refresh token:', error);
            clearRequestQueue();
            throw error;
        } finally {
            isRefreshing.current = false;
        }
        return queueFailedRequest(config);
    };

    // Update tokens in both state and default headers
    const updateTokens = ({ accessToken, csrfToken }) => {
        setAccessToken(accessToken);
        setCSRFToken(csrfToken);
        axiosSecure.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        axiosSecure.defaults.headers.common['X-CSRFToken'] = csrfToken;
    };

    // Retry all queued requests
    const retryQueuedRequests = () => {
        while (requestQueue.current.length > 0) {
            const retryRequest = requestQueue.current.shift();
            retryRequest();
        }
    };

    // Queue a request to be retried after a refresh
    const queueFailedRequest = (config) => {
        return new Promise(resolve => {
            requestQueue.current.push(() => resolve(axiosSecure(config)));
        });
    };

    // Clear all requests in the queue
    const clearRequestQueue = () => {
        requestQueue.current = [];
    };

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use(addTokensToConfig, Promise.reject);
        const responseInterceptor = axiosSecure.interceptors.response.use(response => response, handleResponseError);

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [accessToken, csrftoken, setAccessToken, setCSRFToken, refresh]);

    return axiosSecure;
}
