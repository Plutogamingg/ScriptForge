import useAuth from "./hookAuth"
import useAxiosPrivate from "./hookUrlPrivate"

export default function useUser() {

    const { setUser } = useAuth()
    const axiosPrivateInstance = useAxiosPrivate()

    async function getUser() {
        try {
            const { data } = await axiosPrivateInstance.get('admin/user')

            setUser(data)
        } catch (error) {
            console.log(error.response)
        }
    }

    return getUser
}