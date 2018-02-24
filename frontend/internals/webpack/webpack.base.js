const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');

module.exports = ({
  entry,
  output,
  babelOptions,
  workerName,
  cssLoaderVender,
  cssLoaderApp,
  plugins,
  devtool,
  performance,
}) => ({
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
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.graphql$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
  plugins: plugins.concat([
    new webpack.NamedModulesPlugin(),
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
  ]),
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
});
