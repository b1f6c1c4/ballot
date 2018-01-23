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

class StatusNotInvitedError extends Error {
  constructor() {
    super('Ballot status is not `invited`');
    this.statusCode = 409;
    this.errorCode = 'snid';
  }
}

class StatusNotInvitingError extends Error {
  constructor() {
    super('Ballot status is not `inviting`');
    this.statusCode = 409;
    this.errorCode = 'snid';
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
  UnauthorizedError,
  NotFoundError,
  UsernameMalformedError,
  PasswordMalformedError,
  UsernameExistsError,
  NameMalformedError,
  FieldMalformedError,
  FieldLockedError,
  VoterLockedError,
  StatusNotInvitedError,
  StatusNotInvitingError,
  PublicKeyMalformedError,
  VoterRegisteredError,
};
