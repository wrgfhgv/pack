import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';

const root = document.getElementById('react-container') as HTMLElement;

createRoot(root).render(<App />);


    
