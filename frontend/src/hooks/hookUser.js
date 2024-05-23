import useAuthUser from "./hookAuth";
import useAxiosSecure from "./hookUrlPrivate";

/**
 * Custom hook to retrieve and set user data.
 * Utilizes a secure Axios instance to fetch user details from the server and update the user context.
 *
 * @returns {Function} A function that, when called, fetches the user data.
 */
export default function useUser() {
    const { setUser } = useAuthUser();
    const axiosPrivateInstance = useAxiosSecure();

    /**
     * Fetches user data from the server and updates the user context.
     * Logs and handles any errors that occur during the fetch operation.
     */
    async function getUser() {
        try {
            const response = await axiosPrivateInstance.get('admin/user');
            setUser(response.data); // Assuming `data` contains the user details.
        } catch (error) {
            // log the error and also handle potential scenarios
            console.error("Failed to fetch user data:", error.response || error);
            throw new Error("Error fetching user data"); // Rethrow to allow caller to handle the error.
        }
    }

    return getUser;
}
