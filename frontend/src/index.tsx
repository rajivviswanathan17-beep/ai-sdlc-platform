import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Performance monitoring (optional)
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 AI-SDLC Platform Frontend starting...');
  console.log('Environment:', process.env.REACT_APP_ENVIRONMENT);
  console.log('API URL:', process.env.REACT_APP_API_URL);
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service worker registration for PWA
if ('serviceWorker' in navigator && process.env.REACT_APP_ENABLE_PWA === 'true') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}