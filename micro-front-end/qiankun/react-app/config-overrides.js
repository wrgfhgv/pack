const { name } = require('./package');

module.exports = {
  webpack: config => {
    // 配置为 umd 格式，允许主应用加载
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;
    return config;
  },
  devServer: config => {
    // 允许跨域
    config.headers = {
      'Access-Control-Allow-Origin': '*',
    };
    // 关闭热更新（避免与主应用冲突）
    config.hot = false;
    // 禁止自动打开浏览器
    config.open = false;
    config.port = 3001;
    return config;
  },
};
