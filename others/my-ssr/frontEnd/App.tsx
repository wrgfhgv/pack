import React, { useState, useEffect, useLayoutEffect } from 'react';
import { format } from './format';

interface InitData {
  message: string;
  timestamp: string;
  user: {
    name: string;
    id: number;
  };
  count: number;
}

interface AppProps {
  initData?: InitData;
}

const App = (props: AppProps) => {
  // 从window对象获取初始数据，如果有的话
  const initialData = typeof window !== 'undefined' && (window as any).__initData__ ? 
    (window as any).__initData__ : props.initData;
    
  const [isClient, setIsClient] = useState(false);
  const [count, setCount] = useState(initialData?.count || 0);

  useEffect(() => {
    console.log('useEffect');
    setIsClient(true);
  }, []);

  useLayoutEffect(() => {
    console.log('useLayoutEffect');
  }, []);
  
  return (
    <div>
      <h1>{initialData?.message || 'SSR App'}</h1>
      <p>{isClient ? '客户端' : '服务端'}</p>
      <p>用户: {initialData?.user?.name || 'Guest'} (ID: {initialData?.user?.id || 'N/A'})</p>
      <p>服务器时间: {initialData?.timestamp || 'N/A'}</p>
      <button onClick={() => setCount(count + 1)}>点击 (当前计数: {count})</button>
      <div>{format(123)}</div>
    </div>
  );
};
export const extension = {
  format,
};

export default App;
