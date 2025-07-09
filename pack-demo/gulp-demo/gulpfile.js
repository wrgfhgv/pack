const { src, dest, series, parallel, watch } = require('gulp');
const ts = require('gulp-typescript');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const terser = require('gulp-terser');

// 加载 TypeScript 配置
const tsProject = ts.createProject('tsconfig.json');

// 清理 dist 目录

// 编译 TypeScript/JSX
function buildTsx() {
  return src('src/**/*.{ts,tsx}')
    .pipe(tsProject())
    .on('', err => {
      console.error('TypeScript 编译错误:', err.message);
    })
    .js.pipe(
      babel({
        presets: ['@babel/preset-env'],
      }),
    )
    .pipe(concat('bundle.js'))
    .pipe(terser()) // 生产环境压缩
    .pipe(dest('dist/js'));
}

// 复制 HTML
function copyHtml() {
  return src('index.html').pipe(dest('dist'));
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
}

function reload(cb) {
  browserSync.reload();
  cb();
}

// 定义任务组合
const build = parallel(buildTsx, copyHtml, copyAssets);

// 导出任务
exports.build = build;
exports.serve = series(build, serve);
exports.default = series(build, serve);
