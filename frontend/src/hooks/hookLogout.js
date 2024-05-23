import { useState } from 'react';
import useAuthUser from "./hookAuth";
import { axiosSecure } from "../hoc/url";

/**
 * Hook to handle the logout process.
 * It leverages the useUser hook for state management and axiosSecure for secure API requests.
 * 
 * @returns {object} Contains the logout function and a loading state.
 */
export default function useLogout() {
    const { setUser, setAccessToken, setCSRFToken } = useAuthUser();
    const [loading, setLoading] = useState(false);

    /**
     * Initiates the logout process.
     * This function updates the user-related states to their initial values after a successful logout
     * and handles the loading state throughout the process.
     */
    const logout = async () => {
        setLoading(true);
        try {
            await axiosSecure.post("admin/logout");  // Sends a logout request to the server.
            setAccessToken(null);                   // Clears the access token from state.
            setCSRFToken(null);                     // Clears the CSRF token from state.
            setUser({});                            // Resets the user state to an empty object.
        } catch (error) {
            console.error("Logout failed:", error);
            // Optionally handle errors by returning them or updating a state to display in the UI.
            throw new Error("Logout process failed.");  // Throws an error to be possibly caught by the caller.
        } finally {
            setLoading(false);  // Ensures that the loading state is updated regardless of the outcome.
        }
    };

    return { logout, loading };  // Exposes the logout function and loading state.
}
