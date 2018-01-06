module.exports = {
  sourceFiles: 'docs/api.apib',
  serverPort: 3001,
  autoOptions: true,
  method: [
    '*',
  ],
  header: [
    'Authorization',
  ],
  ignoreHeader: [
    'Authorization',
  ],
};
