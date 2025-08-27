const { src, dest, series, parallel, watch } = require('gulp');
const ts = require('gulp-typescript');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const path = require('path');
const webpackStream = require('webpack-stream');

// 加载 TypeScript 配置
const tsProject = ts.createProject('tsconfig.json');

// 编译 TypeScript/JSX
// function buildTsx() {
//   return (
//     src('src/**/*.{ts,tsx}')
//       .pipe(tsProject())
//       .on('error', err => {
//         console.error('TypeScript 编译错误:', err.message);
//       })
//       .js.pipe(
//         babel({
//           presets: ['@babel/preset-env', '@babel/preset-react'],
//           plugins: ['@babel/plugin-transform-runtime'],
//         }),
//       )
//       .pipe(concat('bundle.js'))
//       // .pipe(terser()) // 生产环境压缩
//       .pipe(dest('dist'))
//       .pipe(browserSync.stream())
//   );
// }

function buildTsx() {
  return src('src/**/*.{ts,tsx}') // 多文件入口
    .pipe(tsProject())
    .on('error', err => {
      console.error('TypeScript 编译错误:', err.message);
    })
    .js.pipe(
      webpackStream({
        entry: './src/main.tsx',
        mode: 'development',
        devtool: 'inline-source-map',
        resolve: {
          extensions: ['.ts', '.tsx', '.js'],
        },
        output: {
          path: path.join(__dirname, 'dist'),
          filename: '[name].js',
        },

        module: {
          rules: [
            {
              test: /\.ts|tsx$/,
              use: 'ts-loader',
            },
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader'], // 添加 CSS 加载器
            },
            {
              test: /\.svg$/,
              use: 'file-loader', // 添加 CSS 加载器
            },
          ],
        },
      }),
    )
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

// 复制 HTML
function copyHtml() {
  return src('index.html').pipe(dest('dist'));
}

// 复制CSS文件
function copyCss() {
  return src('src/**/*.css').pipe(dest('dist/css'));
}

// 复制静态资源
function copyAssets() {
  return src('src/assets/**/*').pipe(dest('dist/assets'));
}

// 启动开发服务器
function serve() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });

  watch('src/**/*.{ts,tsx}', series(buildTsx, reload));
  watch('src/index.html', series(copyHtml, reload));
  watch('src/assets/**/*', series(copyAssets, reload));
  watch('src/**/*.css', series(copyCss, reload));
}

function reload(cb) {
  browserSync.reload();
  cb();
}

// 定义任务组合
const build = parallel(buildTsx, copyHtml, copyAssets, copyCss);

// 导出任务
exports.build = build; // 修复：先清理再构建
exports.serve = series(build, serve);
exports.default = series(build, serve);
