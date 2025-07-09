import React, { useState } from 'react';
import './App.css';

const HeavyComponent = () => {
  const [count, setCount] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  // 使用 Web Worker 执行耗时计算
  const heavyCalculation = () => {
    setIsCalculating(true);
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    
    worker.onmessage = (e) => {
      setResult(e.data);
      setIsCalculating(false);
      worker.terminate();
    };

    worker.postMessage('start');
  };

  return (
    <div className="heavy-component">
      <h2>耗时组件</h2>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        增加计数
      </button>
      <button onClick={heavyCalculation} disabled={isCalculating}>
        {isCalculating ? '计算中...' : '执行耗时计算'}
      </button>
      {result !== null && <p>计算结果: {result}</p>}
    </div>
  );
};

const App = () => {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <div className="app">
      <h1>React Reconciler 演示</h1>
      <div className="controls">
        <button onClick={() => setShowHeavy(!showHeavy)}>
          {showHeavy ? '隐藏' : '显示'} 耗时组件
        </button>
      </div>
      {showHeavy && <HeavyComponent />}
      <div className="explanation">
        <h2>说明</h2>
        <p>这个演示展示了使用 Web Worker 进行耗时计算的效果：</p>
        <ul>
          <li>点击"显示耗时组件"按钮，然后点击"增加计数"按钮</li>
          <li>点击"执行耗时计算"按钮，UI 将保持完全响应</li>
          <li>即使在计算过程中，您也可以继续增加计数</li>
          <li>计算完成后会显示结果</li>
        </ul>
      </div>
    </div>
  );
};

export default App; 