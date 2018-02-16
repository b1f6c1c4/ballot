class TooManyRequestsError extends Error {
  constructor(after) {
    super(`Rate limit exceeded, retry after ${after.toFixed(0)}s`);
    this.statusCode = 429;
    this.errorCode = 'tmrq';
  }
}

class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.statusCode = 403;
    this.errorCode = 'uath';
  }
}

class NotFoundError extends Error {
  constructor() {
    super('Resource not found');
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
    this.statusCode = 409;
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

class StatusNotAllowedError extends Error {
  constructor() {
    super('Ballot status doesn\'t allow the operation');
    this.statusCode = 409;
    this.errorCode = 'stna';
  }
}

class PublicKeyMalformedError extends Error {
  constructor() {
    super('Public key malformed');
    this.statusCode = 400;
    this.errorCode = 'pkmf';
  }
}

class VoterRegisteredError extends Error {
  constructor() {
    super('Voter already registered');
    this.statusCode = 409;
    this.errorCode = 'vtrg';
  }
}

module.exports = {
  TooManyRequestsError,
  UnauthorizedError,
  NotFoundError,
  UsernameMalformedError,
  PasswordMalformedError,
  UsernameExistsError,
  NameMalformedError,
  FieldMalformedError,
  StatusNotAllowedError,
  PublicKeyMalformedError,
  VoterRegisteredError,
};
