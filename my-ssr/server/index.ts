import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import openBrowser from 'opener';
import App from '../frontEnd/App';
import { getTemplate } from '../template.js';

const fs = require('fs');

const path = require('path');
const vm = require('vm');

let formatCode = '';

let fileName = '';

fs.readdirSync(path.join(__dirname, '../dist')).find((file: any) => {
    if (file.startsWith('main') && file.endsWith('.js') && file.split('.').length === 3) {
        fileName = file;
    }
})

const code = fs.readFileSync(path.join(__dirname, '../dist/', fileName), 'utf-8');

const context = {
    module: {exports : {}},
    export: {},
    console,
    global: {self: {}},
}

vm.runInNewContext(code, context);

const extension = context.module.exports;

console.log(123, extension);




const app = express();
const port = 3000;
app.use(express.static('dist'));

const html = renderToString(React.createElement(App));
app.get('/', (_: any, res: { send: (arg0: any) => void; }) => {
    res.send(getTemplate(html, true));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    openBrowser(`http://localhost:${port}`);
});
