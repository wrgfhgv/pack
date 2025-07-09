const getTemplate = (content, isDev = false) => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSR Demo${isDev ? ' - Development' : ''}</title>
    ${!isDev ? '<link rel="stylesheet" href="/style.css">' : ''}
    <style>
        .server-rendered {
            background-color: #e8f5e9;
            padding: 10px;
            margin: 10px 0;
            border: 2px dashed #4caf50;
        }
        .js-disabled-warning {
            background-color: #fff3e0;
            padding: 10px;
            margin: 10px 0;
            border: 2px dashed #ff9800;
        }
        .debug-info {
            background-color: #e3f2fd;
            padding: 10px;
            margin: 10px 0;
            border: 2px dashed #2196f3;
            font-family: monospace;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div class="server-rendered">
        <h2>这是服务端渲染的内容</h2>
        <p>即使禁用 JavaScript，这些内容也会显示</p>
    </div>

    <div class="debug-info">
        <h3>调试信息</h3>
        <p>服务端渲染时间: ${new Date().toLocaleString()}</p>
        <p>内容长度: ${content.length} 字符</p>
        <p>内容预览:</p>
        <div style="max-height: 200px; overflow: auto; background: #fff; padding: 10px;">
            ${content}
        </div>
    </div>

    <div id="root">${content}</div>
    
    <div class="js-disabled-warning">
        <h3>JavaScript 状态</h3>
        <p>如果看到这个警告，说明 JavaScript 已被禁用</p>
        <p>页面将保持静态，无法进行交互</p>
    </div>

    <!-- 客户端 JavaScript 文件，负责：
         1. 水合（Hydration）过程
         2. 处理用户交互
         3. 更新组件状态
         4. 处理副作用（如定时器）
         如果禁用此文件，页面将失去所有交互能力
    -->
    ${!isDev ? '<script src="/bundle.js"></script>' : ''}
</body>
</html>
`;

module.exports = { getTemplate }; 