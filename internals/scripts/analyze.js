const shelljs = require('shelljs');

shelljs.exec('webpack --config ./internals/webpack/webpack.prod.js --profile --json > stats.json');
