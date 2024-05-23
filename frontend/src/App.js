import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import CreateScriptForm from './pages/ScriptPage';
import CreateCharacterForm from './pages/CharacterPage';
import CreateStoryForm from './pages/StoryPage';
import PersistUser from './components/PersistUser';
import Navbar from './components/Nav';
import Home from './pages/HomePage';
import UserMidware from './hoc/auth';
import StorySelection from './pages/StorySelect';
import StoryDetails from './pages/StoryDetail';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import StoryDashboard from './pages/StoryDash';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<PersistUser />}>
          <Route index element={<Home />} />
          <Route path='signup' element={<SignUpPage />} />
          <Route path='login' element={<Login />} />
          <Route path="about-us" element={<AboutPage />} />
          
          {/* Protected Routes */}
          <Route element={<UserMidware />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='create-character' element={<CreateCharacterForm />} />
            <Route path='create-script/:storyId' element={<CreateScriptForm />} />
            <Route path='create-story' element={<CreateStoryForm />} />
            <Route path='story-select' element={<StorySelection />} />
            <Route path='story-dashboard' element={<StoryDashboard />} />
            <Route path='story-details/:storyId' element={<StoryDetails />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path='*' element={<Navigate to='/' />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;