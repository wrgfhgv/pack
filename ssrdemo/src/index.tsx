import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import './style.css';

const container = document.getElementById('root');
if (container) {
    const root = hydrateRoot(container, 
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
    
    if (process.env.NODE_ENV === 'development') {
        console.log('客户端水合开始...');
    }
} 