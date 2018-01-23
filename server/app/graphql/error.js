class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.statusCode = 403;
    this.errorCode = 'uath';
  }
}

class NotFoundError extends Error {
  constructor() {
    super('Not Found');
    this.statusCode = 404;
    this.errorCode = 'ntfd';
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

class NameMalformedError extends Error {
  constructor() {
    super('Name malformed');
    this.statusCode = 400;
    this.errorCode = 'nmmf';
  }
}

class FieldMalformedError extends Error {
  constructor() {
    super('Field malformed');
    this.statusCode = 400;
    this.errorCode = 'fdmf';
  }
}

class FieldLockedError extends Error {
  constructor() {
    super('Field changes locked by ballot status');
    this.statusCode = 409;
    this.errorCode = 'flkd';
  }
}

class VoterLockedError extends Error {
  constructor() {
    super('Voter changes locked by ballot status');
    this.statusCode = 409;
    this.errorCode = 'vlkd';
  }
}

module.exports = {
  UnauthorizedError,
  NotFoundError,
  UsernameMalformedError,
  PasswordMalformedError,
  UsernameExistsError,
  NameMalformedError,
  FieldMalformedError,
  FieldLockedError,
  VoterLockedError,
};
