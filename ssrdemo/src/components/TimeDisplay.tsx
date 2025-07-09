import React, { useState, useEffect } from 'react';

const TimeDisplay: React.FC = () => {
    const [isClient, setIsClient] = useState(false);
    const [time, setTime] = useState(new Date().toLocaleString());
    const [clickCount, setClickCount] = useState(0);

    // 使用 useEffect 来更新客户端状态
    useEffect(() => {
        setIsClient(true);
        const timer = setInterval(() => {
            setTime(new Date().toLocaleString());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 使用服务端时间作为初始值
    const serverTime = new Date().toLocaleString();

    return (
        <div className="time-display" style={{
            border: isClient ? '2px solid #4caf50' : '2px solid #f44336',
            padding: '15px',
            margin: '10px 0',
            backgroundColor: isClient ? '#e8f5e9' : '#ffebee'
        }}>
            <h3>时间显示组件</h3>
            <p>渲染环境: {isClient ? '客户端' : '服务端'}</p>
            <p>服务端渲染时间: {serverTime}</p>
            <p>客户端更新时间: {isClient ? time : serverTime}</p>
            <p>window 对象: {typeof window === 'undefined' ? '不存在' : '存在'}</p>
            <p>document 对象: {typeof document === 'undefined' ? '不存在' : '存在'}</p>
            
            {/* 这个按钮只在客户端水合后才能交互 */}
            <button 
                onClick={() => setClickCount(prev => prev + 1)}
                style={{ 
                    marginTop: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isClient ? 'pointer' : 'not-allowed',
                    opacity: isClient ? 1 : 0.5
                }}
            >
                点击次数: {clickCount}
            </button>
            <p style={{ 
                color: '#666', 
                fontSize: '0.9em', 
                marginTop: '10px',
                fontStyle: 'italic'
            }}>
                {isClient 
                    ? '✅ JavaScript 已启用，组件可以正常交互'
                    : '⚠️ JavaScript 未启用，组件处于静态状态'}
            </p>
        </div>
    );
};

export default TimeDisplay; 