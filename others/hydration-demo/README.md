# React Hydration Demo

## 目录结构

```
.
├── server
│   ├── index.ts         # 服务端入口
│   └── template.ts      # SSR HTML 模板
├── src
│   ├── App.tsx          # React 组件
│   └── client.tsx       # 客户端入口
├── package.json
├── tsconfig.json
```

## 安装依赖

```bash
npm install
```

## 启动项目

```bash
npm start
```

## 访问演示

- 自动水合（React 18+）：[http://localhost:3000/auto](http://localhost:3000/auto)
- 手动水合（React 17风格）：[http://localhost:3000/manual](http://localhost:3000/manual)

## 自动水合 vs 手动水合

### 自动水合（React 18+ 推荐）
- 使用 `hydrateRoot` API
- 更智能，能自动修复部分服务端和客户端不一致的内容
- 控制台会有详细的"可恢复错误"提示
- 代码示例：
  ```ts
  import { hydrateRoot } from 'react-dom/client';
  hydrateRoot(document.getElementById('root'), <App />);
  ```

### 手动水合（React 17 及以前）
- 使用 `hydrate` API
- 对不一致内容更严格，可能直接报错或渲染异常
- 代码示例：
  ```ts
  import { hydrate } from 'react-dom';
  hydrate(<App />, document.getElementById('root'));
  ```

## 错误演示

本项目的 `App.tsx` 里 deliberately 制造了服务端和客户端渲染内容不一致：

```tsx
<div id="hydration-test">
  {typeof window === 'undefined' ? '服务端渲染' : '客户端渲染'}
</div>
```

- 访问 `/auto` 时，React 18 会在控制台提示"可恢复错误"，并自动修复 DOM。
- 访问 `/manual` 时，React 17 风格的 `hydrate` 可能会直接报错或渲染异常。

## 总结
- 推荐新项目使用自动水合（`hydrateRoot`）。
- 旧项目或兼容性需求可用手动水合（`hydrate`），但需注意严格一致性。 