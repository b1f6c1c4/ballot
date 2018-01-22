class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.statusCode = 403;
    this.errorCode = 'uath';
  }
}

class UsernameMalformedError extends Error {
  constructor() {
    super('Username malformed');
    this.statusCode = 400;
    this.errorCode = 'unmf';
  }
}

class PasswordMalformedError extends Error {
  constructor() {
    super('Password malformed');
    this.statusCode = 400;
    this.errorCode = 'pwmf';
  }
}

class UsernameExistsError extends Error {
  constructor() {
    super('UsernameExists');
    this.statusCode = 400;
    this.errorCode = 'unex';
  }
}

module.exports = {
  UnauthorizedError,
  UsernameMalformedError,
  PasswordMalformedError,
  UsernameExistsError,
};
