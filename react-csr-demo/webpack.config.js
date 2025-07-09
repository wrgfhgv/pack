const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgeCssPlugin = require('purgecss-webpack-plugin').PurgeCSSPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const MyPlugin = require('./plugins/plugin');
const loader = require('./loaders/loader');
const glob = require('glob-all');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader', {
          loader: path.resolve(__dirname, 'loaders/loader.js'),
          options: {
            name: '123'
          }
        }],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new PurgeCssPlugin({
      paths: glob.sync(`${path.resolve(__dirname, 'src')}/**/*.{ts,tsx,js,jsx}`, { nodir: true }),
      safelist: ['box2']
    }),
    new TerserPlugin({
      terserOptions: {
        mangle: true,
        compress: {
          dead_code: true,
          drop_console: true,
        }
      }
    }),
    new CssMinimizerPlugin(),
    new MyPlugin(),
  ],
  devServer: {
    static: './dist',
    port: 3001,
    open: true,
  },
  mode: 'development',
  optimization: {
    minimize: true,
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/, // 排除 React
          // name(module) {
          //   const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
          //   return `vendors-${packageName.replace('@', '')}`; // 移除 @ 符号（如果有）
          // },
          name: 'venders',
          minSize: 0,
          minChunks: 1,
          chunks: 'all',
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)/,
          name: 'react',
          chunks: 'all'
        }
        
      }
    }
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 5120000,
    maxAssetSize: 5120000,
  }
}; 