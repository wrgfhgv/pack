"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const App = () => {
    const [count, setCount] = (0, react_1.useState)(0);
    const [isClient, setIsClient] = (0, react_1.useState)(false);
    // 在客户端渲染后立即设置 isClient
    (0, react_1.useEffect)(() => {
        setIsClient(true);
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "\u6C34\u5408\u6F14\u793A" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { children: ["\u8BA1\u6570\u5668: ", count] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setCount(count + 1), children: "\u589E\u52A0" })] }), (0, jsx_runtime_1.jsxs)("div", { id: "hydration-test", style: { padding: '10px', margin: '10px', border: '1px solid #ccc' }, children: [(0, jsx_runtime_1.jsx)("p", { children: "\u670D\u52A1\u7AEF/\u5BA2\u6237\u7AEF\u5185\u5BB9\u5BF9\u6BD4\uFF1A" }), (0, jsx_runtime_1.jsxs)("p", { suppressHydrationWarning: true, children: ["\u670D\u52A1\u7AEF: ", typeof window === 'undefined' ? '服务端渲染' : '客户端渲染'] }), (0, jsx_runtime_1.jsxs)("p", { suppressHydrationWarning: true, children: ["\u65F6\u95F4: ", typeof window === 'undefined' ? new Date().toISOString() : new Date().toISOString()] }), (0, jsx_runtime_1.jsxs)("p", { suppressHydrationWarning: true, children: ["\u968F\u673A\u6570: ", typeof window === 'undefined' ? Math.random() : Math.random()] })] }), (0, jsx_runtime_1.jsx)("div", { style: { padding: '10px', margin: '10px', border: '1px solid #ccc' }, children: (0, jsx_runtime_1.jsx)("p", { children: "\u8FD9\u4E2A\u5185\u5BB9\u5728\u670D\u52A1\u7AEF\u548C\u5BA2\u6237\u7AEF\u662F\u76F8\u540C\u7684\uFF0C\u4E0D\u4F1A\u89E6\u53D1\u6C34\u5408\u4FEE\u590D" }) })] }));
};
exports.default = App;
