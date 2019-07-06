const path = require('path');
const webpack = require('webpack');
const pkg = require(path.resolve(__dirname, 'package.json'));
const browserBaseName = 'hijri';

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
        library: {
            root: pkg.umd_name.split('.'),
            amd: pkg.umd_name,
        },
        libraryTarget: 'umd',
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: `${browserBaseName}.js.map`,
            moduleFilenameTemplate(info) {
                let resourcePath = info.resourcePath;

                // Clean up the source map urls.
                while (resourcePath.startsWith('./') || resourcePath.startsWith('../')) {
                    if (resourcePath.startsWith('./')) {
                        resourcePath = resourcePath.substring(2);
                    } else {
                        resourcePath = resourcePath.substring(3);
                    }
                }

                // We embed the sources so we can falsify the URLs a little, they just
                // need to be identifiers that can be viewed in the browser.
                return `webpack://${pkg.umd_name}/${resourcePath}`;
            }
        }),
    ],
};