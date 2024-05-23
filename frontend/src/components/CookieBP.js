import { useState, createContext, useMemo } from 'react';

// Initial state object for context to manage defaults and structure
const initialState = {
    user: {},
    setUser: () => {},
    accessToken: null,
    setAccessToken: () => {},
    refreshToken: null,
    setRefreshToken: () => {},
    csrftoken: null,
    setCSRFToken: () => {},
    isLoggedIn: false
};

// Create the authentication context with the initial state
export const UserCon = createContext(initialState);

// Provider component to manage and provide authentication state
export function UserConProvider({ children }) {
    const [user, setUser] = useState(initialState.user);
    const [accessToken, setAccessToken] = useState(initialState.accessToken);
    const [refreshToken, setRefreshToken] = useState(initialState.refreshToken);
    const [csrftoken, setCSRFToken] = useState(initialState.csrftoken);

    // Compute the logged-in status based on the presence of an accessToken
    const isLoggedIn = useMemo(() => !!accessToken, [accessToken]);

    // Prepare the context value to pass down to children components
    const contextValue = useMemo(() => ({
        user,
        setUser,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        csrftoken,
        setCSRFToken,
        isLoggedIn
    }), [user, accessToken, refreshToken, csrftoken, isLoggedIn, 
        setUser, setAccessToken, setRefreshToken, setCSRFToken]);

    // Render the provider with the prepared context value
    return (
        <UserCon.Provider value={contextValue}>
            {children}
        </UserCon.Provider>
    );
}

// Default export of the AuthContext for easy import in other parts of the application
export default UserCon;


