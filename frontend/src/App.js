import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import SignUpPage from './pages/SignUpPage';
import SignUp from './pages/signUp';
import CreateScriptForm from './pages/ScriptPage';
import CreateCharacterForm from './pages/CharacterPage';
import CreateStoryForm from './pages/StoryPage';


function App() {
  return (
    <Router>
     
        <Routes>
          <Route path="/" element={<SignUpPage />} />
          <Route path="create-character" element={<CreateCharacterForm />} />
          <Route path="create-script" element={<CreateScriptForm />} />
          <Route path="create-story" element={<CreateStoryForm />} />

          {/* Add more routes as needed */}
        </Routes>
      
    </Router>
  );
}

export default App;
