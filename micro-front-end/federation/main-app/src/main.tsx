import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerMicroApps, start } from 'qiankun';

import './index.css';

// 注册子应用
registerMicroApps([
  {
    name: 'react-app', // 子应用名称（唯一）
    entry: '//localhost:3000', // 子应用入口地址
    container: '#micro-container', // 子应用挂载点
    activeRule: '/react-app', // 激活路由（访问该路径时加载）
    props: { token: 'main-app-token' }, // 传递给子应用的参数
  },
]);

// 启动 qiankun
start({
  sandbox: { strictStyleIsolation: true }, // 开启样式隔离
  prefetch: 'all', // 预加载子应用
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
