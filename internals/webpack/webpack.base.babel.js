const path = require('path');
const webpack = require('webpack');
const transformImports = require('babel-plugin-transform-imports');

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
        use: {
          loader: 'babel-loader',
          query: {
            plugins: [
              [
                transformImports,
                {
                  'material-ui': {
                    transform(name) {
                      if (/Progress$/.test(name)) {
                        return `material-ui/Progress/${name}`;
                      }
                      if (/^Dialog|Dialog$/.test(name)) {
                        return `material-ui/Dialog/${name}`;
                      }
                      if (/^Tab/.test(name)) {
                        return `material-ui/Tabs/${name}`;
                      }
                      if (/^[A-Z]/.test(name)) {
                        return `material-ui/${name}`;
                      }
                      switch (name) {
                        case 'Zoom':
                          return `material-ui/transitions/${name}`;
                        default:
                          return `material-ui/styles/${name}`;
                      }
                    },
                    preventFullImport: true,
                  },
                  'material-ui-icons': {
                    // eslint-disable-next-line no-template-curly-in-string
                    transform: 'material-ui-icons/${member}',
                    preventFullImport: true,
                  },
                },
              ],
            ],
          },
        },
      },
      {
        // Preprocess our own .css files
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.json$/,
        use: 'json-loader',
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
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
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
