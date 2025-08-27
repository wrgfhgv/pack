import React from 'react';
import { renderToString } from 'react-dom/server';
import openBrowser from 'opener';
import { getTemplate } from '../template.js';
import express from 'express';

// 创建Express应用
const app = express();
const port = 3001;
let isServerError = false;

// 直接导入编译后的server端代码
let App: any;
let format: any;
const path = require('path');
const fs = require('fs');

function getFile(filePath: string) {
  const distPath = path.join(__dirname, `../dist/${filePath}`);
  return fs.readdirSync(distPath);
}

// 提供静态文件服务
app.use(express.static('dist/client'));

// 查找dist/server目录下的main文件
const serverFiles = getFile('server');
const mainServerFileName = serverFiles.find(
  (file: any) => file.startsWith('main') && file.endsWith('.js'),
);

if (!mainServerFileName) {
  throw new Error('未找到server端main文件');
}

// 查找dist/client目录下的main文件
const clientFiles = getFile('client');
// 动态导入服务器端模块

try {
  const serverModule = require(path.join('../dist/server', mainServerFileName));
  App = serverModule.default;
  format = serverModule.extension.format;
} catch (e) {
  console.error('动态导入服务器端模块错误:', e);
  isServerError = true;
}

// 处理SSR路由
app.get('/', (req, res) => {
  // 渲染React应用
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(
    `${clientFiles
      .map((file: any) => `<script defer src="/${file}"></script>`)
      .join('')}`,
  );
  if (isServerError) {
    res.end(getTemplate(''));
    return;
  }
  try {
    // 创建初始数据
    const initData = {
      message: 'Hello from Server!',
      timestamp: new Date().toISOString(),
      user: {
        name: 'SSR User',
        id: 1
      },
      count: 42
    };
    
    // 将初始数据传递给App组件
    const appHtml = renderToString(React.createElement(App, { initData }));
    
    // 生成完整HTML
    const html = getTemplate(appHtml, process.env.NODE_ENV !== 'production');

    // 替换模板中的脚本占位符，将初始数据注入到window对象
    const updatedHtml = html.replace(
      '<!-- script -->',
      `<script>window.__initData__ = ${JSON.stringify(initData)}</script>`,
    );
    res.end(updatedHtml);
  } catch (error) {
    console.error('SSR渲染错误:', error);
    if (error instanceof Error) {
      console.error('错误堆栈:', error.stack);
    }
    // res.status(500).send('服务器渲染错误');
    res.end(getTemplate(''));
  }
});

// 启动服务器
const server = app.listen(port, () => {
  console.log(`SSR服务器运行在 http://localhost:${port}`);
  console.log('服务器已成功启动，等待请求...');
  openBrowser(`http://localhost:${port}`);
});

// 捕获服务器错误
server.on('error', (error: any) => {
  console.error('服务器错误:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(
      `端口 ${port} 已被占用，请关闭其他占用该端口的进程或使用其他端口。`,
    );
  }
});
