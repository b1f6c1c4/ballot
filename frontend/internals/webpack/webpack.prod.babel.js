const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const transformImports = require('babel-plugin-transform-imports');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const i18n = require('./i18n');

const extractCss0 = new ExtractTextPlugin({
  filename: '[name].[contenthash:8].css',
  allChunks: true,
});
const extractCss1 = new ExtractTextPlugin({
  filename: '[name].vendor.[contenthash:8].css',
  allChunks: true,
});

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

const materialUiGroups = _.fromPairs([
  'BottomNavigation',
  'Card',
  'Dialog',
  'ExpansionPanel',
  'Form',
  'Input',
  'Gird',
  'List',
  'Menu',
  'Progress',
  'Radio',
  'Snackbar',
  'Table',
].map((g) => [g, new RegExp(`${g}($|[A-Z])|${g}$`)]));

const materialUiMap = (name) => {
  if (/^Tab($|[A-Z])/.test(name)) {
    return `material-ui/Tabs/${name}`;
  }
  if (/^Step($|[A-Z])/.test(name)) {
    return `material-ui/Step/${name}`;
  }
  switch (name) {
    case 'Backdrop':
      return `material-ui/Modal/${name}`;
    case 'Slide':
    case 'Grow':
    case 'Fase':
    case 'Collapse':
    case 'Zoom':
      return `material-ui/transitions/${name}`;
    case 'MuiThemeProvider':
    case 'withStyles':
    case 'withTheme':
    case 'createMuiTheme':
    case 'jssPreset':
      return `material-ui/styles/${name}`;
    default:
      break;
  }
  const cans = _.keys(_.pickBy(materialUiGroups, (r) => r.test(name)));
  if (cans.length === 1) {
    return `material-ui/${cans[0]}/${name}`;
  } else if (cans.length > 1) {
    throw new Error(`Unknown ${name}`);
  }
  return `material-ui/${name}`;
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
      'images/favicon.ico',
      path.join(process.cwd(), 'app/index/index.js'),
    ],
    indexStyle: [
      path.join(process.cwd(), 'app/index/style.js'),
    ],
    app: [
      'redux-form',
      path.join(process.cwd(), 'app/app.js'),
    ],
  },

  babelOptions: {
    plugins: [
      'lodash',
      [
        transformImports,
        {
          'material-ui': {
            transform: materialUiMap,
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

  workerName: '[chunkhash:8].worker.js',
  cssLoaderVender: extractCss1.extract({
    fallback: 'style-loader',
    use: 'css-loader',
  }),
  cssLoaderApp: extractCss0.extract({
    fallback: 'style-loader',
    use: 'css-loader',
  }),

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
  },

  plugins: [
    new GitRevisionPlugin(),
    new NetlifyRedirectsPlugin(),
    extractCss0,
    extractCss1,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'indexCommon',
      chunks: ['index', 'indexStyle'],
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: !!process.env.SOURCE_MAP,
      uglifyOptions: {
        ie8: false,
        output: {
          comments: false,
          beautify: false,
        },
      },
    }),

    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'app/index/index.ejs',
      minify,
      inject: false, // manual inject
      chunksSortMode: 'manual',
      chunks: [
        'indexCommon',
        'index',
        'indexStyle',
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

  ],

  performance: {
    assetFilter: (assetFilename) => !(/(\.map$)|(^(favicon\.))/.test(assetFilename)),
  },
});