const makeMakeExport = () => {
  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line global-require
    const core = require('./core');
    return (k) => core[k];
  }

  // eslint-disable-next-line global-require
  const Worker = require('./core.worker');

  return (k) => (...param) => new Promise((resolve, reject) => {
    const worker = new Worker();
    worker.onmessage = ({ data }) => {
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data.result);
      }
    };
    worker.postMessage({
      method: k,
      param,
    });
  });
};

const makeExport = makeMakeExport();

['generateKeyPair', 'signMessage'].forEach((k) => {
  module.exports[k] = makeExport(k);
});
