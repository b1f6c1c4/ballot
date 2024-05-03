const shelljs = require('shelljs');
const fs = require('fs');

const generateStatus = () => {
  if (!shelljs.which('git')) {
    return undefined;
  }

  const ver = shelljs.exec('git describe --always', { silent: true });
  const hsh = shelljs.exec('git rev-parse HEAD', { silent: true });
  if (ver.code !== 0 || hsh.code !== 0) {
    return undefined;
  }

  return {
    version: ver.stdout.trim(),
    commitHash: hsh.stdout.trim(),
  };
};

const st = generateStatus();
if (st) {
  fs.writeFile('VERSION.json', JSON.stringify(st), 'utf8', (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  });
}

shelljs.mkdir('-p', 'docs/', 'lib/');
shelljs.cp('../docs/public.graphql', 'docs/');
shelljs.cp('../cryptor/build/Release/cryptor.node', 'server/');
shelljs.exec('../cryptor/cpld.bash server/cryptor.node lib/');
