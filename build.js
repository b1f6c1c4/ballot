const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const babel = require('@babel/core');

const compileFile = async (tmpl, file, data) => {
  const res = tmpl(data);
  await fs.writeFile(path.join(__dirname, `./dist/${file}.html`), res);
};

const run = async () => {
  const tmplString = await fs.readFile(path.join(__dirname, './src/index.html'), 'utf-8');
  const tmpl = _.template(tmplString, {
    imports: {
      require: (p) => {
        const cnt = fs.readFileSync(path.join(__dirname, './src/', p), 'utf-8');
        return cnt;
      },
    },
  });
  await fs.emptyDir(path.join(__dirname, './dist/'));
  await fs.mkdir(path.join(__dirname, './dist/assets/'));
  const { code } = await babel.transformFileAsync(
    path.join(__dirname, './src/style.js'),
    {
      ast: false,
      comments: false,
      compact: true,
      filename: './src/style.js',
    },
  );
  await fs.writeFile(path.join(__dirname, './dist/assets/style.js'), code, 'utf-8');
  await fs.copy(
    path.join(__dirname, './src/public/'),
    path.join(__dirname, './dist/assets/'),
  );

  await compileFile(tmpl, 'xxx', {
    data2: 'yoooooo!',
    da: {
      ta1: 'haha hah<script>alert(1);</script>asd&&amp^^adf',
    },
  });
};

run().then(() => {
  console.log('Done');
}).catch((err) => {
  console.error(err);
});
