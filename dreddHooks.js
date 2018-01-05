// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const hooks = require('hooks');
const jwt = require('jsonwebtoken');

const jwtOptions = {
  issuer: 'try-react',
  audience: 'try-react',
  expiresIn: '2h',
};

const token = jwt.sign({
  username: 'admin',
}, process.env.JWT_SECRET || 's3cReT', jwtOptions);

hooks.beforeAll((transactions, cb) => {
  transactions.forEach((transaction) => {
    if (!transaction.request) {
      return;
    }
    if (!transaction.request.headers) {
      return;
    }
    if (!transaction.request.headers.Authorization) {
      return;
    }
    if (transaction.request.headers.Authorization.includes('Bearer JWT')) {
      // eslint-disable-next-line no-param-reassign
      transaction.request.headers.Authorization =
        transaction.request.headers.Authorization.replace('Bearer JWT', `Bearer ${token}`);
    }
  });
  cb();
});
