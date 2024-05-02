import { axiosPrivateInstance } from "../hoc/url";
import { useEffect, useCallback } from 'react';
import useAuth from "./hookAuth";
import useRefreshToken from "./useRefresh";

export default function useAxiosPrivate() {
    const { accessToken, setAccessToken, csrftoken, user } = useAuth();
    const refresh = useRefreshToken();

    const setupInterceptors = useCallback(() => {
        const requestIntercept = axiosPrivateInstance.interceptors.request.use(
            config => {
                if (!config.headers["Authorization"]) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                    config.headers['X-CSRFToken'] = csrftoken;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        const responseIntercept = axiosPrivateInstance.interceptors.response.use(
            response => response,
            async error => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 || error?.response?.status === 401) {
                    if (!prevRequest?.sent) {
                        prevRequest.sent = true;  // mark it now to avoid infinite loop
                        const { csrfToken: newCSRFToken, accessToken: newAccessToken } = await refresh();
                        setAccessToken(newAccessToken);
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        prevRequest.headers['X-CSRFToken'] = newCSRFToken;
                        return axiosPrivateInstance(prevRequest);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivateInstance.interceptors.request.eject(requestIntercept);
            axiosPrivateInstance.interceptors.response.eject(responseIntercept);
        };
    }, [accessToken, csrftoken, refresh, setAccessToken]);

    useEffect(() => {
        const cleanInterceptors = setupInterceptors();
        return cleanInterceptors;
    }, [setupInterceptors]);

    return axiosPrivateInstance;
}
