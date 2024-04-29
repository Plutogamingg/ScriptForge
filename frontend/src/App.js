import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import SignUpPage from './pages/SignUpPage';
import SignUp from './pages/signUp';
import CreateScriptForm from './pages/ScriptPage';
import CreateCharacterForm from './pages/CharacterPage';
import CreateStoryForm from './pages/StoryPage';
import User from './pages/User';
import PersistLogin from './components/PersistLogin';
import Navbar from './components/Nav';
import Home from './pages/Home';
import AuthMiddleware from './hoc/auth';


function App() {
  return <>
    <Navbar />
    <Routes>
      <Route path='/' element={<PersistLogin />}>
        <Route index element={<Home />}></Route>
          <Route path='login' element={<SignUpPage />}></Route>
          <Route path="create-character" element={<CreateCharacterForm />} />
          <Route path="create-script" element={<CreateScriptForm />} />
          <Route path="create-story" element={<CreateStoryForm />} />
          <Route path='user' element={<AuthMiddleware />}>
            <Route index element={<User />}></Route>
        </Route>
      </Route>
      <Route path='*' element={<Navigate to='/' />}></Route>
    </Routes>
  </>
}

export default App;