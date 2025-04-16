import React from 'react';
import { createRoot } from 'react-dom/client';  // This is correct for React 18
import './assets/scss/styles.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);  // Create the root using the element
  root.render(<App />);
} else {
  console.error('No root element found');
}

// Service Worker
serviceWorker.unregister();
