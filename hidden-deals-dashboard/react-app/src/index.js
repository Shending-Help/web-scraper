import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css';
import App from './App';

const rootElement = document.getElementById('hidden-deals-react-app');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Target container 'hidden-deals-react-app' not found in the DOM.");
}