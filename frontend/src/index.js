import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './tailwind.css';
import './custom.css'
import { AuthContextProvider } from './components/CookieBP';
import { CurrentStoryProvider } from './hooks/hookCurrentStory';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <CurrentStoryProvider> {/* Nest CurrentStoryProvider inside AuthContextProvider */}
          <App />
        </CurrentStoryProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
