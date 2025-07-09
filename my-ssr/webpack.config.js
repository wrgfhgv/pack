const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { getTemplate } = require('./template.js');

module.exports = {
    entry: './frontEnd/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[fullhash].js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            templateContent: getTemplate('', true)
        })
    ],
    devServer: {
        port: 3000,
        open: true,
        historyApiFallback: true,
    },
    mode: 'development',
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                }
            }
        }
    }
}
