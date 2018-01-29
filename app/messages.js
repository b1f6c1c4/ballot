import { defineMessages } from 'react-intl';

export default defineMessages({
  username: {
    id: 'app.username',
    defaultMessage: 'Username',
  },
  usernameHelper: {
    id: 'app.usernameHelper',
    defaultMessage: '5+ alphanumeric or dash characters.',
  },
  password: {
    id: 'app.password',
    defaultMessage: 'Password',
  },
  passwordHelper: {
    id: 'app.passwordHelper',
    defaultMessage: '8+ characters.',
  },
  login: {
    id: 'app.login',
    defaultMessage: 'Sign in',
  },
  register: {
    id: 'app.register',
    defaultMessage: 'Sign up',
  },
  clear: {
    id: 'app.clear',
    defaultMessage: 'Clear',
  },
  required: {
    id: 'app.required',
    defaultMessage: 'Required.',
  },
  minChar: {
    id: 'app.minChar',
    defaultMessage: 'At least {m} character(s).',
  },
  alphanumericDash: {
    id: 'app.alphanumericDash',
    defaultMessage: 'Number, alphabet, or dash only.',
  },
  errorUnknown: {
    id: 'app.errorUnknown',
    defaultMessage: 'Unknown error happened.',
  },
  error_netw: {
    id: 'app.error_netw',
    defaultMessage: 'Network is bad.',
  },
  error_unex: {
    id: 'app.error_unex',
    defaultMessage: 'Username exists.',
  },
  error_wgup: {
    id: 'app.error_wgup',
    defaultMessage: 'Username and/or password incorrect.',
  },
});
