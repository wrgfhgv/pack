import './public-path';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__: boolean;
  }
}
// 生命周期：初始化（仅执行一次）
export async function bootstrap() {
  console.log('react-app bootstrap');
}

// 生命周期：卸载（离开子应用时执行）
let root: ReactDOM.Root | null = null;

export async function mount(props: any) {
  console.log('react-app 接收主应用参数：', props);
  // 渲染子应用（注意使用主应用传递的容器）
  const container = props.container || document.getElementById('root');
  root = ReactDOM.createRoot(container.querySelector('#root')!);
  root.render(
    <BrowserRouter basename='/react-app'>
      <App />
    </BrowserRouter>,
  );
}

export async function unmount(props: any) {
  console.log('react-app unmount');
  if (root) {
    root.unmount();
    root = null;
  }
}

// 独立运行时（不嵌入主应用）
if (!window.__POWERED_BY_QIANKUN__) {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
}
