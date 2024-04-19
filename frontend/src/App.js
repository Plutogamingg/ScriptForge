import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Tabs from './components/tabs';

function App() {
  return (
    <div>
      <h1>My Tab Application</h1>
      <Tabs />
    </div>
  );
}

export default App;
