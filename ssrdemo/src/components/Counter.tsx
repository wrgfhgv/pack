import React, { useState } from 'react';

const Counter: React.FC = () => {
    const [count, setCount] = useState(0);

    return (
        <div className="counter">
            <h2>计数器示例</h2>
            <p>当前计数: {count}</p>
            <button onClick={() => setCount(count + 1)}>增加</button>
            <button onClick={() => setCount(count - 1)}>减少</button>
        </div>
    );
};

export default Counter; 