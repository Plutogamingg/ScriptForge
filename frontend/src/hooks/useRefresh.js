import { axiosInstance } from "../hoc/url";
import useAuth from "./hookAuth";

export default function useRefreshToken() {
    const { setAccessToken, setCSRFToken } = useAuth()

    const refresh = async () => {
        try {
            const response = await axiosInstance.post('admin/refresh-token');
            setAccessToken(response.data.access);
            setCSRFToken(response.headers["x-csrftoken"]);
            return { accessToken: response.data.access, csrfToken: response.headers["x-csrftoken"] };
        } catch (error) {
            console.error('Failed to refresh token:', error);
            // Handle token refresh failure, e.g., redirect to login or show an error
            throw error; // Rethrow the error if you need to handle it further up the chain
        }
    }

    return refresh;
}
