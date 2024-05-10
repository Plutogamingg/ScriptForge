import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/hookUrlPrivate'; // Assuming you have a hook to handle authenticated requests

const Dashboard = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [user, setUser] = useState(null); // State to hold user data
    const [loading, setLoading] = useState(true); // Loading state to manage UI loading feedback
    const [error, setError] = useState(''); // Error state to manage errors

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosPrivate.get('/admin/user'); // Modify the URL as per your API
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch user data.');
                setLoading(false);
            }
        };

        fetchUser();
    }, [axiosPrivate]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="dashsel flex flex-col items-center justify-center min-h-screen -mt-20 mb-70" style={{ backgroundRepeat: 'no-repeat' }}>
            <div className="w-full max-w-lg px-6 py-12 text-center">
                <h2 className="title text-5xl font-bold text-white mb-6">
                    <span style={{ color: '#FFA32C' }}>{user ? `${user.name}'s` : "User's"}</span>
                    <span style={{ color: '#0BF1B7' }}> DASHBOARD</span>
                </h2>
            </div>
            <div className="dashsel flex mb-20 flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <button
                    className="dashboard-button text-teal-300 border-teal-300 hover:bg-teal-300 hover:text-white w-full md:w-auto"
                    onClick={() => handleNavigation('/create-character')}
                >
                    Character Create
                </button>
                <button
                    className="dashboard-button bg-orange-500 text-white border-orange-500 hover:bg-white hover:text-orange-500 w-full md:w-auto"
                    onClick={() => handleNavigation('/create-story')}
                >
                    Create Story
                </button>
                <button
                    className="dashboard-button text-teal-300 border-teal-300 hover:bg-teal-300 hover:text-white w-full md:w-auto"
                    onClick={() => handleNavigation('/story-dashboard')}
                >
                    Story Select
                </button>
            </div>
        </div>
    );
    
    }    

export default Dashboard;

