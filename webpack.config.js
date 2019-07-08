const path = require('path');
const webpack = require('webpack');
const pkg = require(path.resolve(__dirname, 'package.json'));
const browserBaseName = pkg.umd_name;

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    mode: 'none',
    node: {
        global: true,
        process: false,
        Buffer: false,
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: [{
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve(__dirname, 'tsconfig.json'),
                },
            }, ],
            exclude: /node_modules/,
        }]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: `${browserBaseName}.js`,
        path: path.resolve(__dirname, 'dist', 'browser'),
        library: pkg.umd_name,
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: `${browserBaseName}.js.map`,
        }),
    ],
};