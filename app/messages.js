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
  min5char: {
    id: 'app.min5char',
    defaultMessage: 'At least 5 characters.',
  },
  min8char: {
    id: 'app.min8char',
    defaultMessage: 'At least 8 characters.',
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
});
