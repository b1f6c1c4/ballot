const _ = require('lodash');
const errors = require('./error');
const { Organizer } = require('../../models/organizers');
const { hashPassword, verifyPassword } = require('../cryptor');
const { issue } = require('../auth');
const logger = require('../../logger')('graphql/auth');

module.exports = {
  resolvers: {
    Mutation: {
      async register(parent, args, context) {
        logger.debug('Mutation.register', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        const { username, password } = args.input;

        if (!/^[a-zA-Z0-9][-a-zA-Z0-9]{4,}$/.test(username)) {
          return new errors.UsernameMalformedError();
        }
        if (password.length < 8) {
          return new errors.PasswordMalformedError();
        }

        try {
          const { hash } = await hashPassword(password);
          const user = new Organizer();
          user._id = username;
          user.hash = hash;
          await user.save();
          logger.info('User registered', user._id);
          return true;
        } catch (e) {
          if (e.code === 11000) { // E11000 duplicate key
            logger.debug('Register', e);
            return new errors.UsernameExistsError();
          }
          logger.error('Register', e);
          return e;
        }
      },

      async login(parent, args, context) {
        logger.debug('Mutation.login', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        const { username, password } = args.input;

        if (!/^[a-zA-Z0-9][-a-zA-Z0-9]{4,}$/.test(username)) {
          return new errors.UsernameMalformedError();
        }
        if (password.length < 8) {
          return new errors.PasswordMalformedError();
        }

        try {
          const tryFind = await Organizer.findById(username, { });
          logger.trace('tryFind', !!tryFind);
          if (!tryFind) {
            logger.debug('Login failed, not found', username);
            return null;
          }
          const { valid } = await verifyPassword(password, tryFind.hash);
          if (!valid) {
            logger.info('Login failed', username);
            return null;
          }
          const jwt = issue({ username });
          logger.info('Login success', username);
          return jwt;
        } catch (e) {
          logger.error('Login', e);
          return e;
        }
      },

      async password(parent, args, context) {
        logger.debug('Mutation.password', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        if (!_.get(context, 'auth.username')) {
          return new errors.UnauthorizedError();
        }

        const { username } = context.auth;
        const { oldPassword, newPassword } = args.input;

        if (oldPassword.length < 8) {
          return new errors.PasswordMalformedError();
        }
        if (newPassword.length < 8) {
          return new errors.PasswordMalformedError();
        }

        try {
          const user = await Organizer.findById(username, {});
          if (!user) {
            return new errors.NotFoundError();
          }
          const { valid } = await verifyPassword(oldPassword, user.hash);
          if (!valid) {
            logger.info('Change password failed', username);
            return false;
          }
          const { hash } = await hashPassword(newPassword);
          user.hash = hash;
          await user.save();
          logger.info('Change password success', username);
          return true;
        } catch (e) {
          logger.error('Change password', e);
          return e;
        }
      },
    },
  },
};
