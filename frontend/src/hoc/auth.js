import useAuth from "../hooks/hookAuth"
import { Navigate, Outlet, useLocation } from "react-router-dom"

// Middleware to protect routes that require authentication
export default function AuthMiddleware() {
    // Retrieve the accessToken from the auth context to check if the user is logged in
    const { accessToken } = useAuth()
    // Get the current location to possibly use it for redirecting back after logging in
    const location = useLocation()

    // Conditionally render child routes if authenticated, otherwise redirect to home
    return (accessToken ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />);
}
