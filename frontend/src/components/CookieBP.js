import { useState, createContext, useMemo  } from 'react'


export const AuthContext = createContext({
    user: {},
    setUser: () => { },
    accessToken: null,
    refreshToken: null,
    csrftoken: null,
    setAccessToken: () => { },
    setRefreshToken: () => { },
    setCSRFToken: () => { },
    isLoggedIn: false, // Add a new value to indicate login status

})

export function AuthContextProvider(props) {

    const [user, setUser] = useState({})
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [csrftoken, setCSRFToken] = useState()
    const isLoggedIn = useMemo(() => !!accessToken, [accessToken]); // Compute login status based on accessToken


    return <AuthContext.Provider value={{
        user, setUser,
        accessToken, setAccessToken,
        refreshToken, setRefreshToken,
        csrftoken, setCSRFToken,
        isLoggedIn 
    }}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext