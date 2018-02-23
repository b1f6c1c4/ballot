const path = require('path');
const express = require('express');

module.exports = function addProdMiddlewares(app, options) {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

  app.use(publicPath, (req, res, next) => {
    req.headers['if-modified-since'] = undefined;
    req.headers['if-none-match'] = undefined;
    next();
  }, express.static(outputPath));
  app.get('*', (req, res) => res.sendFile(path.resolve(outputPath, 'app.html')));
};
