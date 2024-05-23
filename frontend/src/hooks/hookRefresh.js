import { axiosAny } from "../hoc/url";
import useAuthUser from "./hookAuth";

/**
 * Hook to refresh the current user's authentication and CSRF tokens.
 * This function fetches new tokens by making a POST request to the 'admin/refresh-token' endpoint.
 * It updates the tokens in the global state and returns these new tokens.
 */
export default function useRefreshToken() {
    const { setAccessToken, setCSRFToken } = useAuthUser();

    /**
     * Attempts to refresh the user's tokens and updates them in the global state.
     * If successful, the new tokens are returned. If there is an error during the refresh process,
     * the error is logged, and the function rethrows the error to be handled by the caller, allowing
     * for customized error responses such as user notifications or redirections.
     */
    const refresh = async () => {
        try {
            const response = await axiosAny.post('admin/refresh-token');
            const { access } = response.data;
            const csrfToken = response.headers["x-csrftoken"];

            setAccessToken(access);
            setCSRFToken(csrfToken);

            return { accessToken: access, csrfToken };
        } catch (error) {
            console.error('Failed to refresh token:', error);
            throw new Error('Refresh token failed, please log in again.');
        }
    }

    return refresh;
}
