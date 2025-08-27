import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import html from '@rollup/plugin-html';
import fs from 'fs';
import path from 'path';
import replace from '@rollup/plugin-replace';
// 根据当前环境设置值
const isProduction = process.env.NODE_ENV === 'production';
export default {
  input: 'src/main.tsx', // 入口文件
  output: {
    dir: 'dist',
    format: 'esm', // 输出格式：ES 模块
    sourcemap: true,
  },
  // external: ['react', 'react-dom'], // 不打包外部依赖
  plugins: [
    // 处理 TypeScript 和 JSX
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
    }),
    postcss({
      // 关键配置：提取 CSS 到独立文件
      extract: true, // 或指定文件名 'dist/bundle.css'

      // 使用 CSS Modules（可选）
      // modules: true, // 启用 .module.css 模块化

      // 配置 PostCSS 插件（自动前缀、压缩）
      plugins: [
        // autoprefixer(), // 自动加浏览器前缀
        // cssnano(), // 生产环境压缩 CSS
      ],
    }),

    html({
      template: ({ attributes, files, meta, publicPath, title }) => {
        console.log(123, files.css);
        const template = fs.readFileSync(path.resolve('./index.html'), 'utf-8');
        return template
          .replace('<!-- TITLE -->', title || 'Rollup App')
          .replace(
            '<!-- HEAD -->',
            meta
              .map(m => `<meta name="${m.name}" content="${m.content}">`)
              .join('\n'),
          )
          .replace(
            '<!-- SCRIPTS -->',
            (files.js || [])
              .map(
                ({ fileName }) =>
                  `<script type="module" src="${publicPath}${fileName}"></script>`,
              )
              .join('\n'),
          )
          .replace(
            '<!-- STYLES -->',
            (files.css || [])
              .map(
                ({ fileName }) =>
                  `<link rel="stylesheet" href="${publicPath}${fileName}">`,
              )
              .join('\n'),
          );
      },
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        isProduction ? 'production' : 'development',
      ),
      preventAssignment: true, // 防止赋值操作被替换
    }),

    serve({
      open: true, // 自动打开浏览器
      contentBase: 'dist', // 服务器根目录
      port: 5000, // 端口
    }),
    livereload('dist'), // 监听 dist 目录变化:cite[4]:cite[8]

    url({
      include: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.gif'],
      limit: 10 * 1024, // 10kb
      fileName: '[name][extname]',
    }),

    // 解析 node_modules 中的模块
    nodeResolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    }),

    // 将 CommonJS 模块转换为 ES6
    commonjs({
      include: 'node_modules/**',
    }),

    // 使用 Babel 转换 JSX 和 ESNext 特性
    babel({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      babelHelpers: 'runtime',
      presets: ['@babel/preset-react', '@babel/preset-typescript'],
      plugins: ['@babel/plugin-transform-runtime'],
      exclude: 'node_modules/**',
    }),

    // 生产环境压缩代码
    // isProduction && terser(),
  ],
};
