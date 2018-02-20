/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
const _ = require('lodash');
const { exec, mkdir } = require('shelljs');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const fastXmlParser = require('fast-xml-parser');
// const zh = require('../../app/translations/zh.json');
const zh = {
  fuck: '中智',
  shit: '慧全',
  bitch: 'bitch',
  BB: 'BITCH',
};

mkdir('-p', 'font');

const theCodes = new Set();
_.values(zh).forEach((str) => _.range(str.length).forEach((i) => {
  theCodes.add(str.charCodeAt(i));
}));

console.log(`Codes: [${theCodes.size}]`);

const extractNames = (iPath, codes) => new Promise((resolve) => {
  const rl = readline.createInterface({
    input: fs.createReadStream(iPath),
  });

  const result = new Set();

  rl.on('line', (line) => {
    const m = line.match(/^\s*<map code="0x([0-9a-f]+)" name="cid([0-9]{5})"\/>/);
    if (!m) return;
    const code = parseInt(m[1], 16);
    if (!codes.has(code)) return;
    const name = parseInt(m[2], 16);
    result.add(name);
  });

  rl.on('close', () => {
    resolve(result);
  });
});

const filterNames = (iPath, oPath, names) => new Promise((resolve, reject) => {
  const outputFile = fs.createWriteStream(oPath);
  const rl = readline.createInterface({
    input: fs.createReadStream(iPath),
  });

  outputFile.on('err', reject);
  outputFile.on('close', resolve);

  const STATE = {
    NONE: 0,
    OPEN: 1,
  };
  let state = 0;
  let reg = null;

  rl.on('line', (line) => {
    switch (state) {
      case STATE.NONE: {
        let tag;
        if (line.includes('<GPOS>')) {
          tag = 'GPOS';
        } else if (line.includes('<GSUB>')) {
          tag = 'GSUB';
        } else if (line.includes('<VORG>')) {
          tag = 'VORG';
        } else {
          const m = line.match(/^(\s*)<([a-zA-Z]+) .*="cid([0-9]{5})"[^/]*(\/?)>/);
          if (!m) break;
          if (names.has(parseInt(m[3], 16))) break;
          if (m[4]) return;
          [, , tag] = m;
        }
        state = STATE.OPEN;
        reg = new RegExp(`</${tag}>$`);
        return;
      }
      case STATE.OPEN: {
        if (reg.test(line)) {
          state = STATE.NONE;
        }
        return;
      }
      default:
        reject(new Error('Wrong state'));
        return;
    }
    const ln = line.replace(/,cid([0-9]{5})/g, (match, name) => {
      if (names.has(parseInt(name, 16))) {
        return '';
      }
      return undefined;
    }).replace(/cid([0-9]{5}),/g, (match, name) => {
      if (names.has(parseInt(name, 16))) {
        return '';
      }
      return undefined;
    });
    outputFile.write(`${ln}\n`);
  });

  rl.on('close', () => {
    outputFile.end();
  });
});

const toXml = (ftmp) => new Promise((resolve, reject) => {
  fs.readFile(ftmp, 'utf-8', (err, xml) => {
    if (err) {
      reject(err);
      return;
    }

    const obj = fastXmlParser.parse(xml, {
      attributeNamePrefix: '_',
      attrNodeName: false,
      textNodeName: 'text',
      ignoreAttributes: false,
      ignoreNameSpace: true,
      allowBooleanAttributes: false,
      parseNodeValue: false,
      parseAttributeValue: false,
      trimValues: true,
      decodeHTMLchar: false,
      cdataTagName: false,
    });

    resolve(obj);
  });
});

const filterFd = (obj) => new Promise((resolve) => {
  const active = new Set();
  obj.ttFont.CFF.CFFFont.CharStrings.CharString.forEach((cs) => {
    const fd = parseInt(cs._fdSelectIndex, 10);
    active.add(fd);
  });

  const arr = [...active].sort((a, b) => a - b);
  obj.ttFont.CFF.CFFFont.CharStrings.CharString.forEach((cs) => {
    const fd = parseInt(cs._fdSelectIndex, 10);
    _.set(cs, '_fdSelectIndex', arr.indexOf(fd));
  });

  const p = 'ttFont.CFF.CFFFont.FDArray.FontDict';
  _.set(obj, p, arr.map((i) => _.set(_.get(obj, p)[i], '_index', arr.indexOf(i))));

  resolve(arr);
});

const filterSubrs = (obj, fdsRaw) => new Promise((resolve) => {
  const fds = fdsRaw.length;
  const subrs = _.times(fds, () => new Set());
  const gsubrs = new Set();

  const connect = (gen, set) => {
    for (const elem of gen) {
      set.add(elem);
    }
  };

  // eslint-disable-next-line func-names
  const extractGlobal = function* (cs) {
    const reg = /([0-9]+) callgsubr/g;
    let match;
    // eslint-disable-next-line no-cond-assign
    while (match = reg.exec(cs.text)) {
      yield parseInt(match[1], 10);
    }
  };

  // eslint-disable-next-line func-names
  const extract = function* (cs) {
    const reg = /([0-9]+) callsubr/g;
    let match;
    // eslint-disable-next-line no-cond-assign
    while (match = reg.exec(cs.text)) {
      yield parseInt(match[1], 10);
    }
  };

  obj.ttFont.CFF.CFFFont.CharStrings.CharString.forEach((cs) => {
    const fd = cs._fdSelectIndex;
    connect(extractGlobal(cs), gsubrs);
    connect(extract(cs), subrs[fd]);
  });

  obj.ttFont.CFF.CFFFont.FDArray.FontDict.forEach((fdRaw) => {
    const fd = parseInt(fdRaw._index, 10);
    const active = subrs[fd];
    if (!active) return;
    const queue = [...active];
    const css = fdRaw.Private.Subrs.CharString;
    console.log(`Direct len of fd ${fdsRaw[fd]} is: ${active.size} / ${css.length}`);
    while (queue.length) {
      const id = queue.shift();
      connect(extractGlobal(css[id]), gsubrs);
      for (const elem of extract(css[id])) {
        if (!active.has(elem)) {
          active.add(elem);
          queue.push(elem);
        }
      }
    }
    console.log(`Active len of fd ${fdsRaw[fd]} is: ${active.size} / ${css.length}`);
  });

  {
    const active = gsubrs;
    const queue = [...active];
    const css = obj.ttFont.CFF.GlobalSubrs.CharString;
    console.log(`Active len of global is: ${active.size} / ${css.length}`);
    while (queue.length) {
      const id = queue.shift();
      for (const elem of extractGlobal(css[id])) {
        if (!active.has(elem)) {
          active.add(elem);
          queue.push(elem);
        }
      }
    }
    console.log(`Active len of global is: ${active.size} / ${css.length}`);
  }

  const arrGlobal = [...gsubrs].sort((a, b) => a - b);
  const arrs = subrs.map((subr) => [...subr].sort((a, b) => a - b));

  const gReplace = (t) => t.replace(/([0-9]+) callgsubr/g, (match, id) => {
    const i = parseInt(id, 10);
    const idx = arrGlobal.indexOf(i);
    if (idx === -1) {
      throw new Error(`Not found ${i} in global`);
    }
    return `${idx} callgsubr`;
  });
  const lReplace = (fd) => (t) => t.replace(/([0-9]+) callsubr/g, (match, id) => {
    const i = parseInt(id, 10);
    const idx = arrs[fd].indexOf(i);
    if (idx === -1) {
      throw new Error(`Not found ${i} in ${fd}`);
    }
    return `${idx} callsubr`;
  });

  {
    const p = 'ttFont.CFF.GlobalSubrs.CharString';
    _.set(obj, p, arrGlobal.map((i) => {
      const cs = _.get(obj, p)[i];
      _.set(cs, '_index', arrGlobal.indexOf(i));
      _.set(cs, 'text', gReplace(cs.text));
      return cs;
    }));
  }

  obj.ttFont.CFF.CFFFont.FDArray.FontDict.forEach((fdRaw, fd) => {
    const p = 'Private.Subrs.CharString';
    _.set(fdRaw, p, arrs[fd].map((i) => {
      const cs = _.get(fdRaw, p)[i];
      _.set(cs, '_index', arrs[fd].indexOf(i));
      _.set(cs, 'text', gReplace(cs.text));
      _.set(cs, 'text', lReplace(fd)(cs.text));
      return cs;
    }));
  });

  obj.ttFont.CFF.CFFFont.CharStrings.CharString.forEach((cs) => {
    const fd = cs._fdSelectIndex;
    _.set(cs, 'text', gReplace(cs.text));
    _.set(cs, 'text', lReplace(fd)(cs.text));
  });

  resolve();
});

const fromXml = (obj, ftmp) => new Promise((resolve, reject) => {
  // eslint-disable-next-line new-cap
  const parser = new fastXmlParser.j2xParser({
    attributeNamePrefix: '_',
    attrNodeName: false,
    textNodeName: 'text',
    ignoreAttributes: false,
    ignoreNameSpace: true,
    allowBooleanAttributes: false,
    parseNodeValue: false,
    parseAttributeValue: false,
    trimValues: true,
    decodeHTMLchar: false,
    cdataTagName: false,
    format: true,
    indentBy: '  ',
    supressEmptyNode: true,
  });

  const xml = parser.parse(obj);

  const head = '<?xml version="1.0" encoding="UTF-8"?>\n';

  fs.writeFile(ftmp, head + xml, 'utf-8', (err) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(obj);
  });
});

const ttx = (ftmp, fout) => new Promise((resolve, reject) => {
  exec(`ttx --flavor woff2 -o ${fout} ${ftmp}`, {
    silent: false,
  }, (code) => {
    if (code) {
      reject();
    } else {
      resolve();
    }
  });
});

const tasks = ['Thin'].map(async (x) => {
  const fin = path.join(__dirname, `../../app/images/fonts/ttx/NotoSansSC-${x}.ttx`);
  const ftmp1 = path.join(__dirname, `../../app/images/fonts/ttx/NotoSansSC-${x}-1.ttx`);
  const ftmp2 = path.join(__dirname, `../../app/images/fonts/ttx/NotoSansSC-${x}-2.ttx`);
  const fout = path.join(__dirname, `../../app/images/fonts/NotoSansSC-${x}-X.woff2`);
  // const names = await extractNames(fin, theCodes);
  // await filterNames(fin, ftmp1, names);
  const obj = await toXml(ftmp1);
  const fds = await filterFd(obj);
  await filterSubrs(obj, fds);
  await fromXml(obj, ftmp2);
  await ttx(ftmp2, fout);
});

Promise.all(tasks)
  .then(() => {
    console.log('Done');
  })
  .catch((err) => {
    console.error(err);
  });
