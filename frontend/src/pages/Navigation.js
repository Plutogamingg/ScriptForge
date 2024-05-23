// Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-black px-5 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white">
          <Link to="/" className="text-xl font-bold">SF Script Force</Link>
        </div>
        <div className="flex items-center">
          <Link to="/page1" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Page 1</Link>
          <Link to="/page2" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Page 2</Link>
          {/* ... more links */}
          <Link to="/login" className="text-blue-500 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
