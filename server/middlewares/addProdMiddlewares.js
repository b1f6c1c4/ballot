const path = require('path');
const express = require('express');

module.exports = function addProdMiddlewares(app, options) {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

  if (process.env.REDIRECT_URL) {
    app.get('*', (req, res) => {
      let url = process.env.REDIRECT_URL;
      if (req.get('host').includes('try-react-staging')) {
        url = url.replace('try-react', 'try-react-staging');
      }
      res.redirect(301, url + req.originalUrl);
    });
  } else {
    app.use(publicPath, express.static(outputPath));
    app.get('*', (req, res) => res.sendFile(path.resolve(outputPath, 'app.html')));
  }
};
