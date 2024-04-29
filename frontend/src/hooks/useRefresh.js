import { axiosInstance } from "../hoc/url";
import useAuth from "./hookAuth";

export default function useRefreshToken() {
    const { setAccessToken, setCSRFToken } = useAuth()

    const refresh = async () => {
        const response = await axiosInstance.post('admin/refresh-token')
        setAccessToken(response.data.access)
        setCSRFToken(response.headers["x-csrftoken"])

        return { accessToken: response.data.access, csrfToken: response.headers["x-csrftoken"] }
    }

    return refresh
}