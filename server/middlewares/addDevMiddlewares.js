const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const options = require('../../internals/webpack/webpack.dev');
const { dllPlugin } = require('../../package.json');

module.exports = (app) => {
  const compiler = webpack(options);
  const { publicPath } = options.output;
  const middleware = webpackDevMiddleware(compiler, {
    publicPath,
    stats: 'errors-only',
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem;

  if (dllPlugin) {
    const dllPath = path.join(__dirname, '../../', dllPlugin.path);
    app.use(`${publicPath}dll`, express.static(dllPath));
  }

  app.get(publicPath, (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'app.html'), (err, file) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(file.toString());
      }
    });
  });
};
