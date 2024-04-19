import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
//import Profile from './Profile';
//import Logout from './Logout';
import SignUp from '../pages/signUp';

function AccountManagement() {
    return (
        <div>
            <h2>Account Management</h2>
            <nav className="bg-gray-200 p-3">
                <ul className="flex space-x-4">
                    <li><Link to="/signup" className="hover:text-blue-500">Sign Up</Link></li>
                    <li><Link to="logout" className="hover:text-blue-500">Log Out</Link></li>
                </ul>
            </nav>
            <Routes>
            <Route path="/signup" element={<SignUp />} />

            </Routes>
        </div>
    );
}

export default AccountManagement;
