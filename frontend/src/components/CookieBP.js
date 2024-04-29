import React, { useState, createContext, useMemo } from 'react';

// Create a default state for the authentication context.
// This initial state holds the basic structure and default values
// for the authentication context, providing a single source of truth
// for these initial settings.
const initialAuthState = {
    user: {}, // Initially, there's no user information available
    accessToken: null, // Access token starts as null until login
    refreshToken: null, // Refresh token starts as null until obtained
    csrftoken: null, // CSRF token also starts as null
};

// Create the authentication context.
// This context provides a way to share authentication-related data and functions
// across components without needing to pass them explicitly through props.
export const AuthContext = createContext({
    ...initialAuthState, // Include the initial state
    setUser: () => {}, // Functions to update the state, defaulting to no-op
    setAccessToken: () => {},
    setRefreshToken: () => {},
    setCSRFToken: () => {},
});

// Create the context provider component.
// This component wraps other components to provide the AuthContext values.
// It manages state for user, access token, refresh token, and CSRF token.
export const AuthContextProvider = ({ children }) => {
    // State management for user and tokens
    const [user, setUser] = useState(initialAuthState.user); // User state
    const [accessToken, setAccessToken] = useState(initialAuthState.accessToken); // Access token state
    const [refreshToken, setRefreshToken] = useState(initialAuthState.refreshToken); // Refresh token state
    const [csrftoken, setCSRFToken] = useState(initialAuthState.csrftoken); // CSRF token state

    // Memoize the context value to avoid unnecessary re-renders.
    // This ensures that the context value only changes when one of the dependencies changes,
    // preventing components from re-rendering unnecessarily.
    const authContextValue = useMemo(() => ({
        user, setUser, // User state and setter function
        accessToken, setAccessToken, // Access token and setter function
        refreshToken, setRefreshToken, // Refresh token and setter function
        csrftoken, setCSRFToken, // CSRF token and setter function
    }), [user, accessToken, refreshToken, csrftoken]); // Re-compute only when these change

    // Return the provider with the children components wrapped inside.
    // This allows any component within the AuthContextProvider to access
    // the authentication-related state and functions defined here.
    return (
        <AuthContext.Provider value={authContextValue}>
            {children} {/* All child components will have access to AuthContext*/}
        </AuthContext.Provider>
    );
};

// Default export for the AuthContext, allowing other modules to import and use it.
export default AuthContext;
