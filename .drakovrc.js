module.exports = {
  sourceFiles: 'docs/public.apib',
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
