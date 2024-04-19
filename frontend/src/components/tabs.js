import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import SignUp from '../pages/signUp';
import AccountManagement from './AccountManagement';
//import Settings from '../pages/Settings';

function Tabs() {
  return (
    <Router>
      <div className="flex flex-col items-center">
        <nav className="w-full bg-gray-800 p-4 text-white">
          <ul className="flex justify-center space-x-4">
            <li className="px-3 py-2 rounded-lg hover:bg-gray-700"><Link to="/signup">Sign Up</Link></li>
            <li className="px-3 py-2 rounded-lg hover:bg-gray-700"><Link to="/account">Account Management</Link></li>
            <li className="px-3 py-2 rounded-lg hover:bg-gray-700"><Link to="/settings">Settings</Link></li>
          </ul>
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/account/*" element={<AccountManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default Tabs;
