import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
    const [count, setCount] = useState(0);
    const [isClient, setIsClient] = useState(false);

    // 在客户端渲染后立即设置 isClient
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div>
            <h1>水合演示</h1>
            <div>
                <p>计数器: {count}</p>
                <button onClick={() => setCount(count + 1)}>增加</button>
            </div>
            <div 
                id="hydration-test" 
                style={{ padding: '10px', margin: '10px', border: '1px solid #ccc' }}
            >
                <p>服务端/客户端内容对比：</p>
                <p suppressHydrationWarning>
                    服务端: {typeof window === 'undefined' ? '服务端渲染' : '客户端渲染'}
                </p>
                <p suppressHydrationWarning>
                    时间: {typeof window === 'undefined' ? new Date().toISOString() : new Date().toISOString()}
                </p>
                <p suppressHydrationWarning>
                    随机数: {typeof window === 'undefined' ? Math.random() : Math.random()}
                </p>
            </div>
            <div style={{ padding: '10px', margin: '10px', border: '1px solid #ccc' }}>
                <p>这个内容在服务端和客户端是相同的，不会触发水合修复</p>
            </div>
        </div>
    );
};

export default App; 