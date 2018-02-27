const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const secretResources = require('../../app/secret/translations');
const i18n = require('./i18n');

module.exports = ({
  mode,
  entry,
  output,
  babelOptions,
  workerName,
  cssLoaderVender,
  cssLoaderApp,
  inject,
  minify,
  optimization,
  plugins,
  noHtml,
  devtool,
  performance,
}) => {
  const htmlPlugins = [
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'app/index/index.ejs',
      minify,
      inject,
      chunksSortMode: 'manual',
      chunks: [
        'index',
      ],
    }),

    // Minify and optimize the app.html
    new HtmlWebpackPlugin({
      filename: 'app.html',
      template: 'app/app.ejs',
      minify,
      inject,
      chunks: [
        'app',
      ],
    }),

    // Copy the secret/index.html
    new HtmlWebpackPlugin({
      filename: 'secret/index.html',
      template: 'app/secret/index.ejs',
      inject: true,
      chunks: [],
      i18n: i18n(secretResources),
    }),

    // I18n the secret/index.ejs
    ..._.chain(i18n(secretResources)).toPairs().map(([k, v]) => new HtmlWebpackPlugin({
      filename: `secret/${k}.html`,
      template: 'app/secret/locale.ejs',
      inject: true,
      chunks: [],
      i18n: v,
    })).value(),
  ];

  return {
    mode,
    entry,
    output: _.merge({
      path: path.resolve(process.cwd(), 'build'),
      publicPath: '/',
    }, output),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: babelOptions,
          }],
        },
        {
          test: /\.worker\.js$/,
          use: [{
            loader: 'worker-loader',
            options: {
              name: workerName,
            },
          }, {
            loader: 'babel-loader',
            options: babelOptions,
          }],
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          exclude: /outdatedbrowser/,
          use: cssLoaderVender || ['style-loader', 'css-loader'],
        },
        {
          test: /(?<!style)\.css$/,
          exclude: /node_modules/,
          use: cssLoaderApp || ['style-loader', 'css-loader'],
        },
        {
          test: /\.(svg)$/,
          loader: 'raw-loader',
        },
        {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[hash:8].[ext]',
            },
          },
        },
        {
          test: /\.(jpg|png|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[hash:8].[ext]',
            },
          },
        },
        {
          test: /\.graphql$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        },
      ],
    },
    optimization: _.merge({
      namedModules: true,
    }, optimization),
    plugins: [
      new webpack.ProvidePlugin({
        // make fetch available
        jQuery: 'jquery',
        fetch: 'exports-loader?self.fetch!whatwg-fetch',
        WOW: 'exports-loader?self.WOW!wowjs',
      }),

      // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
      // inside your code for any environment checks; UglifyJS will automatically
      // drop any unreachable code.
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          API_URL: JSON.stringify(process.env.API_URL),
        },
      }),

      ...(noHtml ? [] : htmlPlugins),

      ...plugins,
    ],
    resolve: {
      modules: ['app', 'node_modules'],
      extensions: [
        '.js',
      ],
      mainFields: [
        'browser',
        'jsnext:main',
        'main',
      ],
    },
    devtool,
    target: 'web', // Make web variables accessible to webpack, e.g. window
    performance,
    stats: {
      modules: false,
      assets: true,
      assetsSort: 'name',
      chunks: false,
      children: false,
      colors: true,
    },
  };
};
