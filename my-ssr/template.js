const getTemplate = (content, isDev = false) => {
    return `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SSR</title>
    </head>
    <body>
        <div id="root">
            ${isDev ? '测试环境' : '生产环境'}
            <div id="react-container">${content}</div>
        </div>
    </body>
</html>`;
};

module.exports = { getTemplate };