import 'babel-polyfill';
import * as core from './core';

const process = async ({ method, param }) => {
  const func = core[method];
  return func(...param);
};

/* eslint-disable no-restricted-globals */
onmessage = ({ data }) => {
  process(data)
    .then((result) => {
      postMessage({ result });
      close();
    })
    .catch((error) => {
      postMessage({ error });
      close();
    });
};
/* eslint-enable no-restricted-globals */
