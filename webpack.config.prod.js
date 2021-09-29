const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        'main': './src/scripts/main.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist', 'scripts'),
        publicPath: './dist/scripts/'
    },
    devtool: '',
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            { useBuiltIns: 'usage', corejs: { version: 3 } }
                        ]
                    ]
                }
            }
        }]
    },
    plugins: [new CleanPlugin.CleanWebpackPlugin()]
};