const shelljs = require('shelljs');
const chalk = require('chalk');

// Generate stats.json file with webpack
shelljs.exec(
  'webpack --config internals/webpack/webpack.prod.js --profile --json > stats.json',
  () => {
    /* eslint-disable no-console */
    console.log('Done, please visit');
    console.log(chalk.magenta('http://webpack.github.io/analyse/'));
    /* eslint-enable no-console */
  },
);
