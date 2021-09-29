const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        'main': './src/scripts/main.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'scripts'),
        publicPath: '/scripts'
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        // ['@babel/preset-env', { targets: "defaults" }]
                        ['@babel/preset-env',
                            { useBuiltIns: 'usage', corejs: { version: 3 } }
                        ]
                    ]
                }
            }
        }]
    },
    plugins: [
        new CleanPlugin.CleanWebpackPlugin()
    ]
};