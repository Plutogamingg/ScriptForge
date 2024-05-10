import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/hookAuth';

export default function Navbar() {
    const { isLoggedIn, setAccessToken } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        setAccessToken(null);
        navigate('/login');
        setMenuOpen(false); // Close menu upon logging out
    };

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    

    return (
        <nav className={`${isMenuOpen ? 'bg-transparent' : 'bg-[#1a1a2e]'} p-3 w-full text-white relative`} style={{ height: '10vh' }}>
            <div className="container mx-auto flex items-center justify-between">
                <button className="text-white md:hidden" onClick={toggleMenu}>
                    {/* Hamburger Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                </button>
                {/* Desktop Links */}
                <div className="flex-grow md:flex md:items-center md:justify-between">
                    <div className="hidden md:flex md:flex-row gap-4 p-3 md:p-0">
                        <NavLink to="/" className={({ isActive }) =>
                            isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
                        }>Home</NavLink>
                        <NavLink to="/about-us" className={({ isActive }) =>
                            isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
                        }>About Us</NavLink>
                        {!isLoggedIn && (
                            <NavLink to="/signup" className={({ isActive }) =>
                                isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
                            }>Sign Up</NavLink>
                        )}
                        {isLoggedIn && (
                            <NavLink to="/dashboard" className={({ isActive }) =>
                                isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
                            }>Dashboard</NavLink>
                        )}
                    </div>
                    <div className="hidden md:flex">
                        {!isLoggedIn ? (
                            <NavLink to="/login" className="text-orange-500 border-orange-500 border-2 px-3 py-2 rounded-full ml-4">
                                Sign In
                            </NavLink>
                        ) : (
                            <button onClick={handleLogout} className="text-orange-500 border-orange-500 border-2 px-3 py-2 rounded-full ml-4">
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* Mobile Overlay */}
            {isMenuOpen && (
                <div className="nav-overlay active" onClick={toggleMenu}>
                    <div className="nav-menu active" onClick={(e) => e.stopPropagation()}>
                        {/* Mobile Links */}
                        <NavLink to="/" onClick={toggleMenu} className={({ isActive }) =>
                            isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
                        }>Home</NavLink>
                        <NavLink to="/about-us" onClick={toggleMenu} className={({ isActive }) =>
                            isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
                        }>About Us</NavLink>
                        {!isLoggedIn && (
                            <NavLink to="/signup" onClick={toggleMenu} className={({ isActive }) =>
                                isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
                            }>Sign Up</NavLink>
                        )}
                        {isLoggedIn && (
                            <NavLink to="/dashboard" onClick={toggleMenu} className={({ isActive }) =>
                                isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
                            }>Dashboard</NavLink>
                        )}
                        {!isLoggedIn ? (
                            <NavLink to="/login" onClick={toggleMenu} className="text-orange-500 border-orange-500 border-2 px-3 py-2 rounded-full">
                                Sign In
                            </NavLink>
                        ) : (
                            <button onClick={handleLogout} className="text-orange-500 border-orange-500 border-2 px-3 py-2 rounded-full">
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
            <div className={`${isMenuOpen ? 'border-transparent' : 'border-t border-white'} absolute bottom-0 left-0 w-full`}></div>
        </nav>
    );
}
