import { useContext, useDebugValue } from "react";
import AuthContext from "../components/CookieBP";

// Custom hook to access the authentication context
export default function useAuth() {
    // Accessing the auth context to get authentication-related data
    const { auth } = useContext(AuthContext)

    // Enhancing debugging by displaying authentication status in React DevTools
    useDebugValue(auth, auth => auth?.user ? "Logged In" : "Logged Out");

    // Return the auth context to be used by components
    return useContext(AuthContext);
}
