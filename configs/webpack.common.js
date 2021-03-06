const webpack = require('webpack');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

const paths = require('./paths');
const getClientEnvironment = require('./env');

const env = getClientEnvironment();
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    target: 'web',
    entry: [
        !isProduction && `webpack-dev-server/client?http://${process.env.HOST}:${process.env.PORT}`,
        'babel-polyfill',
        'whatwg-fetch',
        paths.mainEntry,
    ],
    output: {
        path: paths.appBuild,
        pathinfo: !isProduction,
        // dev use “in-memory” files
        filename: paths.appBundle,
        // chunkFilename: 'static/js/[name].chunk.js',
        publicPath: paths.appPublicPath, // TODO: review
    },
    resolve: {
        extensions: ['.js', '.json'],
        modules: [
            'node_modules',
            paths.appSrc,
        ],
    },
    module: {
        rules: [
            // "file" loader makes sure those assets end up in the `build` folder.
            // When you `import` an asset, you get its filename.
            {
                exclude: [/\.html$/, /\.(js|jsx)$/, /\.css$/, /\.json$/, /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: 'file-loader',
                options: {
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
            // "url" loader works just like "file" loader but it also embeds
            // assets smaller than specified size as data URLs to avoid requests.
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
            {
                test: /\.js?$/,
                include: paths.appSrc,
                loaders: 'babel-loader',
                options: {
                    cacheDirectory: true,
                },
            },
        ],
    },
    plugins: [
        new InterpolateHtmlPlugin(env.raw),
        // new InterpolateHtmlPlugin(env.raw), TODO: check this
        // Makes some environment variables available to the JS code
        new webpack.DefinePlugin(env.stringified),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
};
