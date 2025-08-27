# SSR应用运行指南

## 项目简介
这是一个基于React和Express的服务器端渲染(SSR)应用示例。

## 运行步骤

### 1. 安装依赖
```bash
cd d:\vscode\resouce\others\my-ssr
npm install
```

### 2. 构建项目
```bash
npm run build
```
这会同时构建客户端和服务器端代码，输出到`dist/client`和`dist/server`目录。

### 3. 启动服务器
```bash
npm run start
```
或直接启动服务器（假设已构建）：
```bash
npm run start:prod
```

### 4. 访问应用
服务器启动后，会自动打开浏览器访问 http://localhost:3000

## 开发模式
如需开发模式运行（客户端渲染）：
```bash
npm run dev
```

## 项目结构
- `frontEnd/`: 前端React代码
- `server/`: 服务器端代码
- `dist/`: 构建输出目录
  - `client/`: 客户端构建产物
  - `server/`: 服务器端构建产物
- `webpack.config.js`: Webpack配置文件
- `template.js`: HTML模板文件