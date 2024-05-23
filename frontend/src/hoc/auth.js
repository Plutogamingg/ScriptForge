import useAuthUser from "../hooks/hookAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// Middleware component to enforce authentication on protected routes
export default function UserMidware() {
    // Retrieves the access token from the authentication context to verify user authentication status
    const { accessToken } = useAuthUser();  
    // Fetches the current routing location, used to redirect users back to their intended page after logging in
    const location = useLocation();     
    // Checks if a valid access token exists
    if (accessToken) {
        // Renders child routes when the user is authenticated, allowing access to the protected component
        return <Outlet />;
    } else {
        // Redirects to the home page if the user is not authenticated, preserving the origin route for potential post-login redirection
        return <Navigate to="/" state={{ from: location }} replace />;
    }
};
