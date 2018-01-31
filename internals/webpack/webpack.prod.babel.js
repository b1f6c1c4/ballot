// Important modules this config uses
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const minify = {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true,
};

class NetlifyRedirectsPlugin {
  apply(compiler) {
    const data = '/* /app.html 200\n';
    compiler.plugin('emit', (compilation, cb) => {
      // eslint-disable-next-line no-param-reassign, no-underscore-dangle
      compilation.assets._redirects = {
        source: () => data,
        size: () => data.length,
      };
      cb();
    });
  }
}

module.exports = require('./webpack.base.babel')({
  // In production, we skip all hot-reloading stuff
  entry: {
    index: [
      path.join(process.cwd(), 'app/index/index.js'),
    ],
    app: [
      path.join(process.cwd(), 'app/app.js'),
    ],
  },

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },

  plugins: [
    new GitRevisionPlugin(),
    new NetlifyRedirectsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      children: true,
      minChunks: 2,
      async: true,
    }),

    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'app/index/index.ejs',
      minify,
      inject: false, // manual inject
      chunks: [
        'index',
        'app', // prefetch
      ],
    }),

    // Minify and optimize the app.html
    new HtmlWebpackPlugin({
      filename: 'app.html',
      template: 'app/app.ejs',
      minify,
      inject: true,
      chunks: [
        'app',
      ],
    }),

  ],

  performance: {
    assetFilter: (assetFilename) => !(/(\.map$)|(^(favicon\.))/.test(assetFilename)),
  },
});
