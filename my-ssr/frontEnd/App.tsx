import React, { useEffect, useState, useLayoutEffect } from 'react';
import { format } from './format';

const App = (props: any) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        console.log('useEffect');
    }, []);

    useLayoutEffect(() => {
        console.log('useLayoutEffect');
    }, [])
    return <div>
        {isClient ? '客户端' : '服务端'}
        {format(123)}
    </div>;
};

export default App; 