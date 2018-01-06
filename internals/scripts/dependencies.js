// No need to build the DLL in production
if (process.env.NODE_ENV === 'production') {
  process.exit(0);
}

require('shelljs/global');

const path = require('path');
const fs = require('fs');
const exists = fs.existsSync;
const writeFile = fs.writeFileSync;

const defaults = require('lodash/defaultsDeep');
const pkg = require(path.join(process.cwd(), 'package.json'));
const dllConfig = pkg.dllPlugin;
const outputPath = path.join(process.cwd(), dllConfig.path);
const dllManifestPath = path.join(outputPath, 'package.json');

mkdir('-p', outputPath);

echo('Building the Webpack DLL...');

// the BUILDING_DLL env var is set to avoid confusing the development environment
exec('cross-env BUILDING_DLL=true webpack --display-chunks --color --config internals/webpack/webpack.dll.babel.js --hide-modules');
