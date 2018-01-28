import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'app.components.LoginPage.header',
    defaultMessage: 'Sign in / Sign up',
  },
  description: {
    id: 'app.components.LoginPage.description',
    defaultMessage: 'Sign up here to use our service.',
  },
  username: {
    id: 'app.components.LoginPage.username',
    defaultMessage: 'Username',
  },
  usernameHelper: {
    id: 'app.components.LoginPage.usernameHelper',
    defaultMessage: '5+ alphanumeric or dash characters.',
  },
  password: {
    id: 'app.components.LoginPage.password',
    defaultMessage: 'Password',
  },
  passwordHelper: {
    id: 'app.components.LoginPage.passwordHelper',
    defaultMessage: '8+ characters.',
  },
  login: {
    id: 'app.components.LoginPage.login',
    defaultMessage: 'Sign in',
  },
  register: {
    id: 'app.components.LoginPage.register',
    defaultMessage: 'Sign up',
  },
  clear: {
    id: 'app.components.LoginPage.clear',
    defaultMessage: 'Clear',
  },
  required: {
    id: 'app.components.LoginPage.required',
    defaultMessage: 'Required.',
  },
  min5char: {
    id: 'app.components.LoginPage.min5char',
    defaultMessage: 'At least 5 characters.',
  },
  min8char: {
    id: 'app.components.LoginPage.min8char',
    defaultMessage: 'At least 8 characters.',
  },
  alphanumericDash: {
    id: 'app.components.LoginPage.alphanumericDash',
    defaultMessage: 'Number, alphabet, or dash only.',
  },
});
