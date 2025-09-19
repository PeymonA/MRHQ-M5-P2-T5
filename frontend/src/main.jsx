import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './index.css';

export function renderToDom(container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}