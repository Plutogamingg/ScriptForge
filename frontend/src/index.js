import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './tailwind.css';
import './custom.css'
import { UserConProvider } from './components/CookieBP';
import { CurrentStoryProvider } from './hooks/hookCurrentStory';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserConProvider>
        <CurrentStoryProvider>
          <App />
        </CurrentStoryProvider>
      </UserConProvider>
    </BrowserRouter>
  </React.StrictMode>
);
