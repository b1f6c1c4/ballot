const path = require('path');
const webpack = require('webpack');

module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  }, options.output),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: options.babelOptions || {},
        }],
      },
      {
        test: /\.worker\.js$/,
        use: [{
          loader: 'worker-loader',
          options: {
            name: options.workerName,
          },
        }, {
          loader: 'babel-loader',
          options: options.babelOptions || {},
        }],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: options.cssLoaderVender || ['style-loader', 'css-loader'],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: options.cssLoaderApp || ['style-loader', 'css-loader'],
      },
      {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        loader: 'file-loader',
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'file-loader',
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
  plugins: options.plugins.concat([
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
    new webpack.NamedModulesPlugin(),
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
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
});
