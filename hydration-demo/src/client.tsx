import React from 'react';
import App from './App';

// 根据当前路径决定使用哪种水合方式
const path = window.location.pathname;

if (path === '/auto') {
    // 自动水合 (React 18)
    import('react-dom/client').then(({ hydrateRoot }) => {
        const root = hydrateRoot(
            document.getElementById('root')!,
            <App />
        );
    });
} else if (path === '/manual') {
    // 手动水合 (React 17 风格)
    import('react-dom').then((ReactDOM: any) => {
        ReactDOM.hydrate(
            <App />,
            document.getElementById('root')
        );
    });
} 