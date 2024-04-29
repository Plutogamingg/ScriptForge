import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/hookAuth'; // Import the custom hook to access authentication-related context.

export default function Navbar() {
    // Retrieve the user object from the authentication context to check if the user is logged in.
    const { user } = useAuth(); 
    const [isOpen, setIsOpen] = useState(false); // State to handle menu toggle


    return (
        // Main navigation container styled with Tailwind CSS for a dark theme and padding.
        <nav className='bg-gray-800 p-3'> 
            { /* Container to align and space navigation items responsively.*/}
            <div className="container mx-auto flex flex-wrap items-center justify-between">
            { /* Responsive menu button for mobile devices that toggles the navigation links visibility. */}
            <button className="text-white inline-flex p-3 rounded md:hidden ml-auto outline-none"
                        onClick={() => setIsOpen(!isOpen)} // Toggle menu visibility
                        aria-controls="navbarSupportedContent"
                        aria-expanded={isOpen}
                        aria-label="Toggle navigation">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                { /* Navigation links container that adapts for mobile and desktop views. */}
                <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbarSupportedContent">
                { /* List of navigation links. */}
                    <ul className='flex flex-col md:flex-row list-none ml-auto'>
                    { /* Home link that is always visible. */}
                        <li className='nav-item'>
                            <NavLink className={({ isActive }) => 
                                isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                            } to={'/'}>Home</NavLink>
                        </li>
                        { /* About Us link that is always visible. */}
                            <li className='nav-item'>
                                <NavLink className={({ isActive }) => 
                                    isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                                } to={'/about-us'}>About Us</NavLink>
                            </li>
                        { /* Conditional rendering based on the authentication state: */}
                        { /* Display the Login link if no user is authenticated. */}
                        {!user && (
                            <li className='nav-item'>
                                <NavLink className={({ isActive }) =>
                                    isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                                } to={'/login'}>Login</NavLink>
                            </li>
                        )}
                       { /* Display these links only if a user is logged in: */}
                        {user && (
                            <>
                                { /* Link to the Create Story page. */}
                                <li className='nav-item'>
                                    <NavLink className={({ isActive }) =>
                                        isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                                    } to={'/create-story'}>Create Story</NavLink>
                                </li>
                                { /* Link to the User profile page. */}
                                <li className='nav-item'>
                                    <NavLink className={({ isActive }) =>
                                        isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                                    } to={'/auth/user'}>User</NavLink>
                                </li>
                                { /* Link to the Create Story page. */}
                                <li className='nav-item'>
                                    <NavLink className={({ isActive }) =>
                                        isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                                    } to={'/create-character'}>Create Character</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
