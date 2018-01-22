class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.statusCode = 403;
    this.errorCode = 'uath';
  }
}

module.exports = {
  UnauthorizedError,
};
