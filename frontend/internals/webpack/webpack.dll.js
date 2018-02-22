/**
 * WEBPACK DLL GENERATOR
 *
 * This profile is used to cache webpack's module
 * contexts for external library and framework type
 * dependencies which will usually not change often enough
 * to warrant building them from scratch every time we use
 * the webpack process.
 */

const { join } = require('path');
const webpack = require('webpack');
// eslint-disable-next-line import/no-dynamic-require
const pkg = require(join(process.cwd(), 'package.json'));

if (!pkg.dllPlugin) { process.exit(0); }

const dllConfig = pkg.dllPlugin;
const outputPath = join(process.cwd(), dllConfig.path);

module.exports = require('./webpack.base')({
  context: process.cwd(),
  entry: dllConfig.dlls,
  devtool: 'eval',
  output: {
    filename: '[name].dll.js',
    path: outputPath,
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: join(outputPath, '[name].json'),
    }),
  ],
  performance: {
    hints: false,
  },
});
