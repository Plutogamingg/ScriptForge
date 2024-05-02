import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/hookAuth'; // Import the custom hook to access authentication-related context.
import { useCurrentStory } from '../hooks/hookCurrentStory';

export default function Navbar() {
    const { user } = useAuth(); // Use the useAuth hook to access user state
    const [isOpen, setIsOpen] = useState(false); // State to handle menu toggle

    const { currentStory } = useCurrentStory();
    const navigate = useNavigate();

    // Function to navigate programmatically
    const handleCreateScriptClick = () => {
        if (currentStory && currentStory.id) {
            navigate(`/create-script/${currentStory.id}`);
        } else {
            alert('No story selected');
        }
    };

    return (
        <nav className='bg-transparent p-3 w-full text-white main-nav'> 
            <div className="container mx-auto flex flex-wrap items-center justify-between w-full">
                <button className="text-white inline-flex p-3 rounded md:hidden ml-auto outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-controls="navbarSupportedContent"
                        aria-expanded={isOpen}
                        aria-label="Toggle navigation">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                <div className={`flex justify-between items-center w-full ${isOpen ? 'block' : 'hidden'} md:flex`} id="navbarSupportedContent">
                    <ul className='flex flex-col md:flex-row list-none ml-auto md:ml-0'>
                        <li className='nav-item'>
                            <NavLink className={({ isActive }) =>
                                isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                            } to={'/'}>Home</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className={({ isActive }) => 
                                isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                            } to={'/about-us'}>About Us</NavLink>
                        </li>
                        {!user && (
                            <li className='nav-item'>
                                <NavLink className={({ isActive }) =>
                                    isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                                } to={'/login'}>Login</NavLink>
                            </li>
                        )}
                        {user && (
                            <>
                                <li className='nav-item'>
                                    <NavLink className={({ isActive }) =>
                                        isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                                    } to={'/create-story'}>Create Story</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink className={({ isActive }) =>
                                        isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                                    } to={'/user'}>User</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink className={({ isActive }) =>
                                        isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                                    } to={'/create-character'}>Create Character</NavLink>
                                </li>
                                {currentStory && (
                                    <>
                                        <li className='nav-item'>
                                            <NavLink to={`/create-script/${currentStory.id}`} className={({ isActive }) =>
                                                isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                                            }>
                                                Create Script
                                            </NavLink>
                                        </li>
                                        <li className='nav-item'>
                                            <NavLink to={`/story-details/${currentStory.id}`} className={({ isActive }) =>
                                                isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                                            }>
                                                Story Details
                                            </NavLink>
                                        </li>
                                    </>
                                )}
                                <li className='nav-item'>
                                    <NavLink className={({ isActive }) =>
                                        isActive ? 'nav-link text-white px-3 py-2 rounded md:bg-blue-500' : 'nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded'
                                    } to={'/story-select'}>Select Story</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                    <div>
                        <NavLink className={({ isActive }) =>
                            isActive ? 'nav-link text-white px-3 py-2 rounded-full md:bg-blue-500' : 'nav-link text-orange-500 border-orange-500 border-2 hover:bg-orange-500 hover:text-white px-3 py-2 rounded-full'
                        } to={'/sign-in'}>Sign In</NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}
