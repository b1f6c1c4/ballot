const shelljs = require('shelljs');
const path = require('path');

// eslint-disable-next-line global-require, import/no-dynamic-require
const { dllPlugin } = require(path.join(process.cwd(), 'package.json'));
const outputPath = path.join(process.cwd(), dllPlugin.path);

// No need to build the DLL in production
if (process.env.NODE_ENV === 'production') {
  process.exit(0);
}

shelljs.mkdir('-p', outputPath);

// eslint-disable-next-line no-console
console.log('Building the Webpack DLL...');

// the BUILDING_DLL env var is set to avoid confusing the development environment
shelljs.exec('cross-env BUILDING_DLL=true webpack --display-chunks --color --config internals/webpack/webpack.dll.js --hide-modules');
