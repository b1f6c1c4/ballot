const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const i18n = require('./i18n');
const logger = require('../../server/logger');
const { dllPlugin } = require('../../package.json');

const plugins = [
  new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
  new webpack.NoEmitOnErrorsPlugin(),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'app/index/index.ejs',
    inject: true,
    chunksSortMode: 'manual',
    chunks: [
      'outdated',
      'index',
    ],
  }),
  new HtmlWebpackPlugin({
    filename: 'app.html',
    template: 'app/app.ejs',
    inject: true,
    chunks: [
      'outdated',
      'app',
    ],
  }),

  // Copy the secret/index.html
  new HtmlWebpackPlugin({
    filename: 'secret/index.html',
    template: 'app/secret/index.ejs',
    inject: true,
    chunks: [],
    i18n,
  }),

  // I18n the secret/index.ejs
  ..._.chain(i18n).toPairs().map(([k, v]) => new HtmlWebpackPlugin({
    filename: `secret/${k}.html`,
    template: 'app/secret/locale.ejs',
    inject: true,
    chunks: [],
    i18n: v,
  })).value(),
];

if (dllPlugin) {
  glob.sync(`${dllPlugin.path}/*.dll.js`).forEach((dllPath) => {
    plugins.push(
      new AddAssetHtmlPlugin({
        filepath: dllPath,
        includeSourcemap: false,
      }),
    );
  });
}

module.exports = require('./webpack.base')({
  // Add hot reloading in development
  entry: {
    outdated: [
      'index/outdated.js',
      'file-loader?name=assets/[name].[ext]!resource/favicon.ico',
      'file-loader?name=assets/[name].[ext]!outdatedbrowser/outdatedbrowser/outdatedbrowser.min.css',
      'file-loader?name=assets/[name].[ext]!outdatedbrowser/outdatedbrowser/outdatedbrowser.min.js',
    ],
    index: [
      'webpack-hot-middleware/client?reload=true',
      'index/style.js',
      'index/index.js',
    ],
    app: [
      'webpack-hot-middleware/client?reload=true',
      'root.js',
    ],
  },

  // Don't use hashes in dev mode for better performance
  output: {
    filename: 'assets/[name].js',
    chunkFilename: 'assets/[name].chunk.js',
  },

  // Add development plugins
  // eslint-disable-next-line no-use-before-define
  plugins: dependencyHandlers().concat(plugins),

  // Emit a source map for easier debugging
  // See https://webpack.js.org/configuration/devtool/#devtool
  devtool: 'eval-source-map',

  performance: {
    hints: false,
  },
});

function dependencyHandlers() {
  // Don't do anything during the DLL Build step
  if (process.env.BUILDING_DLL) { return []; }

  if (!dllPlugin) return [];

  const dllPath = path.resolve(process.cwd(), dllPlugin.path);

  const manifestPath = path.resolve(dllPath, 'main.json');

  if (!fs.existsSync(manifestPath)) {
    logger.error('The DLL manifest is missing. Please run `yarn build:dll`');
    process.exit(0);
  }

  return [
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      // eslint-disable-next-line import/no-dynamic-require
      manifest: require(manifestPath), // eslint-disable-line global-require
    }),
  ];
}
