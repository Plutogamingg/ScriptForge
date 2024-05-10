import { useEffect, useRef } from 'react';
import useAuth from './hookAuth';
import useRefreshToken from './useRefresh';
import { axiosPrivateInstance } from '../hoc/url';

export default function useAxiosPrivate() {
    const { accessToken, setAccessToken, csrftoken, setCSRFToken } = useAuth();
    const refresh = useRefreshToken();
    const requestQueue = useRef([]);
    const isRefreshing = useRef(false);

    useEffect(() => {
        const requestIntercept = axiosPrivateInstance.interceptors.request.use(
            config => {
                // Attach the latest access token and CSRF token to every request
                config.headers['Authorization'] = `Bearer ${accessToken}`;
                config.headers['X-CSRFToken'] = csrftoken;
                return config;
            },
            error => Promise.reject(error)
        );

        const responseIntercept = axiosPrivateInstance.interceptors.response.use(
            response => response,
            async error => {
                const prevRequest = error?.config;
                if ((error.response?.status === 403 || error.response?.status === 401) && !prevRequest.sent) {
                    prevRequest.sent = true;  // Mark the request to avoid loops
        
                    if (!isRefreshing.current) {
                        isRefreshing.current = true;
                        refresh().then(tokens => {
                            setAccessToken(tokens.accessToken);
                            setCSRFToken(tokens.csrfToken);
        
                            axiosPrivateInstance.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
                            axiosPrivateInstance.defaults.headers.common['X-CSRFToken'] = tokens.csrfToken;
        
                            while (requestQueue.current.length > 0) {
                                const retryRequest = requestQueue.current.shift();
                                retryRequest();  // Execute the function to retry the API call
                            }
        
                            isRefreshing.current = false;
                        }).catch(refreshError => {
                            console.error('Failed to refresh token:', refreshError);
                            while (requestQueue.current.length > 0) {
                                requestQueue.current.shift(); // Clear the queue if the refresh fails
                            }
                            isRefreshing.current = false;
                            return Promise.reject(refreshError);
                        });
                    }
        
                    // Return a promise that resolves when the queued request is retried
                    return new Promise(resolve => {
                        requestQueue.current.push(() => resolve(axiosPrivateInstance({
                            ...prevRequest,
                            headers: {
                                ...prevRequest.headers,
                                'Authorization': `Bearer ${accessToken}`,
                                'X-CSRFToken': csrftoken
                            }
                        })));
                    });
                }
                return Promise.reject(error);
            }
        );
        

        // Clean up the interceptors when the component unmounts or dependencies change
        return () => {
            axiosPrivateInstance.interceptors.request.eject(requestIntercept);
            axiosPrivateInstance.interceptors.response.eject(responseIntercept);
        };
    }, [accessToken, csrftoken, setAccessToken, setCSRFToken, refresh]);

    return axiosPrivateInstance;
}
