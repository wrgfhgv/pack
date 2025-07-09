"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplate = void 0;
const getTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>水合演示</title>
</head>
<body>
    <div id="root">${content}</div>
    <script src="/dist/client.js"></script>
</body>
</html>
`;
exports.getTemplate = getTemplate;
