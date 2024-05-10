import useAuth from "./hookAuth"
import { axiosPrivateInstance } from "../hoc/url"

export default function useLogout() {
    const { setUser, setAccessToken, setCSRFToken } = useAuth()

    const logout = async () => {
        try {
            const response = await axiosPrivateInstance.post("admin/logout")

            setAccessToken(null)
            setCSRFToken(null)
            setUser({})

        } catch (error) {
            console.log(error)
        }
    }

    return logout
}