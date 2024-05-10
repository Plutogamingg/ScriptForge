// useUserAuthStatus.js
import { useCallback, useState } from 'react';
import useAxiosPrivate from '../hooks/hookUrlPrivate';
import useRefreshToken from './useRefresh';

const useUserAuthStatus = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const refresh = useRefreshToken();

    const fetchUser = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosPrivate.get('/admin/user');
            setUser(response.data);
            setLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                try {
                    await refresh(); // Refresh token if unauthorized
                    const retryResponse = await axiosPrivate.get('/admin/user');
                    setUser(retryResponse.data);
                } catch (retryError) {
                    console.error('Error fetching user after refresh:', retryError);
                    setUser(null);
                }
            } else {
                console.error('Error fetching user:', error);
                setUser(null);
            }
            setLoading(false);
        }
    }, [axiosPrivate, refresh]);

    return { user, loading, fetchUser };
};

export default useUserAuthStatus;
