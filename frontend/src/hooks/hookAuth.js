import { useContext, useDebugValue } from "react";
import UserCon from "../components/CookieBP";

// Custom hook to access the authentication context
export default function useAuthUser() {
    // Accessing the authentication context to retrieve auth-related data
    const context = useContext(UserCon);
  
    // Enhancing debugging by displaying the authentication status in React DevTools
    useDebugValue(context?.auth, (auth) => auth?.user ? "Logged In" : "Logged Out");
  
    // Returning the auth context to be used by components
    return context;
  }
  
