const _ = require('lodash');
const compare = require('secure-compare');
const errors = require('./error');
const Organizer = require('../../models/organizers');
const { argon2i } = require('../cryptor');
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
          const { hash, salt } = await argon2i(password);
          const user = new Organizer();
          user._id = username;
          user.salt = salt;
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
          const salt = tryFind ? tryFind.salt : undefined;
          const { hash } = await argon2i(password, salt);
          const hash0 = tryFind ? tryFind.hash : hash;
          let result = compare(hash0, hash);
          if (!tryFind) {
            result = false;
          }
          if (!result) {
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
            return new Error();
          }
          const res = await argon2i(oldPassword, user.salt);
          const oldHash = res.hash;
          const result = compare(oldHash, user.hash);
          if (!result) {
            logger.info('Change password failed', username);
            return false;
          }
          const { hash, salt } = await argon2i(newPassword);
          user.salt = salt;
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
