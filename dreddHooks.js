// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const hooks = require('hooks');

hooks.beforeEach((transaction) => {
  if (!transaction.expected.headers['Content-Type']) {
    return;
  }
  if (transaction.expected.headers['Content-Type'].includes('text/html')) {
    // eslint-disable-next-line no-param-reassign
    transaction.expected.body = transaction.expected.body.replace(/^\s+|\s+$/g, '');
  }
});
