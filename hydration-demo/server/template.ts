export const getTemplate = (content: string) => `
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