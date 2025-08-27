import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import './style.css';

const root = document.getElementById('react-container') as HTMLElement;

hydrateRoot(root, <App></App>);
