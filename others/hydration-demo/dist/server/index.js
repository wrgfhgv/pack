"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const react_1 = __importDefault(require("react"));
const server_1 = require("react-dom/server");
const App_1 = __importDefault(require("../src/App"));
const template_1 = require("./template");
const app = (0, express_1.default)();
const port = 3000;
// 静态文件服务
app.use(express_1.default.static('.'));
// 自动水合路由
app.get('/auto', (_, res) => {
    const html = (0, server_1.renderToString)(react_1.default.createElement(App_1.default));
    res.send((0, template_1.getTemplate)(html));
});
// 手动水合路由
app.get('/manual', (_, res) => {
    const html = (0, server_1.renderToString)(react_1.default.createElement(App_1.default));
    res.send((0, template_1.getTemplate)(html));
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`自动水合演示: http://localhost:${port}/auto`);
    console.log(`手动水合演示: http://localhost:${port}/manual`);
});
