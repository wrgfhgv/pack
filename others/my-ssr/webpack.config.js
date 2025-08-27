const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { getTemplate } = require('./template.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const env = process.env.config;

// 基础配置
const baseConfig = {
  entry: './frontEnd/index.tsx',
  output: {
    path: path.resolve(__dirname, `dist/${env}`),
    filename: '[name].[fullhash].js',
  },
  target: env === 'client' ? 'web' : 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: env === 'client' ? ['style-loader', 'css-loader'] : ['css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  mode: 'development',
};

// 客户端配置
const clientConfig = {
  ...baseConfig,
  plugins: [
    // new HtmlWebpackPlugin({
    //   templateContent: getTemplate('', true),
    // }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, `dist/${env}`)],
    }),
  ],
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
};

// 服务器端配置
const serverConfig = {
  ...baseConfig,
  entry: './frontEnd/App.tsx', // 直接以App组件为入口
  output: {
    ...baseConfig.output,
    library: { type: 'commonjs2' }, // 导出为commonjs模块
    libraryTarget: 'commonjs2',
  },
  externals: {
    // 排除 React 相关库，由 Node 环境直接加载
    react: 'commonjs react',
    'react-dom': 'commonjs react-dom',
    'react-dom/server': 'commonjs react-dom/server',
    // 如果使用了 React Router 等库，也需要排除
    'react-router-dom': 'commonjs react-router-dom',
  },
  // externals: [nodeExternals()], // 暂时禁用排除node_modules依赖
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, `dist/${env}`)],
    }),
  ], // 服务器端不需要HtmlWebpackPlugin
};

module.exports = env === 'client' ? clientConfig : serverConfig;
