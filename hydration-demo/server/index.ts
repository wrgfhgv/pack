import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App';
import { getTemplate } from './template';

const app = express();
const port = 3000;

// 静态文件服务
app.use(express.static('.'));

// 自动水合路由
app.get('/auto', (_, res) => {
    const html = renderToString(React.createElement(App));
    res.send(getTemplate(html));
});

// 手动水合路由
app.get('/manual', (_, res) => {
    const html = renderToString(React.createElement(App));
    res.send(getTemplate(html));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`自动水合演示: http://localhost:${port}/auto`);
    console.log(`手动水合演示: http://localhost:${port}/manual`);
}); 