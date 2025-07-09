import express from 'express';
import { renderToString } from 'react-dom/server';
import React from 'react';
import App from '../src/App';
import { getTemplate } from './template.js';

const app = express();
const port = 3000;

// 静态文件服务
app.use(express.static('dist'));

// 服务端渲染
app.get('*', (req, res) => {
    try {
        // 确保在服务端渲染时捕获任何错误
        const html = renderToString(React.createElement(App));
        
        // 添加一些调试信息
        console.log('服务端渲染的 HTML:', html);
        
        res.send(getTemplate(html));
    } catch (error: any) {
        console.error('服务端渲染错误:', 123);
        // 如果渲染失败，至少返回一个基本的错误信息
        res.send(getTemplate(`
            <div style="color: red; padding: 20px;">
                <h2>服务端渲染出错</h2>
                <p>${error?.message || '未知错误'}</p>
            </div>
        `));
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 