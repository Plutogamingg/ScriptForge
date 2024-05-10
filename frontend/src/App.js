import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import CreateScriptForm from './pages/ScriptPage';
import CreateCharacterForm from './pages/CharacterPage';
import CreateStoryForm from './pages/StoryPage';
import User from './pages/User';
import PersistLogin from './components/PersistLogin';
import Navbar from './components/Nav';
import Home from './pages/Home';
import AuthMiddleware from './hoc/auth';
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
        <Route element={<PersistLogin />}>
          <Route index path='/' element={<Home />} />
          <Route path='signup' element={<SignUpPage />} />
          <Route path='login' element={<Login />} />
          <Route path="about-us" element={<AboutPage />} />
          {/* Protected Routes */}
          <Route element={<AuthMiddleware />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path="create-character" element={<CreateCharacterForm />} />
            <Route path="/create-script/:storyId" element={<CreateScriptForm />} />
            <Route path="create-story" element={<CreateStoryForm />} />
            <Route path="story-select" element={<StorySelection />} />
            <Route path="story-dashboard" element={<StoryDashboard />} />
            <Route path="/story-details/:storyId" element={<StoryDetails />} />
            <Route path='user' element={<User />} />
          </Route>
          <Route path='*' element={<Navigate to='/' />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
