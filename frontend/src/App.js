import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import SignUpPage from './pages/SignUpPage';
import SignUp from './pages/signUp';


function App() {
  return (
    <Router>
     
        <Routes>
          <Route path="/" element={<SignUpPage />} />
          {/* Add more routes as needed */}
        </Routes>
      
    </Router>
  );
}

export default App;
