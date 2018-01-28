import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'app.components.LoginForm.header',
    defaultMessage: 'Sign in',
  },
  description: {
    id: 'app.components.LoginForm.description',
    defaultMessage: 'Sign in here to use our service.',
  },
  username: {
    id: 'app.components.LoginForm.username',
    defaultMessage: 'Username',
  },
  usernameHelper: {
    id: 'app.components.LoginForm.usernameHelper',
    defaultMessage: '5+ alphanumeric or dash characters.',
  },
  password: {
    id: 'app.components.LoginForm.password',
    defaultMessage: 'Password',
  },
  passwordHelper: {
    id: 'app.components.LoginForm.passwordHelper',
    defaultMessage: '8+ characters.',
  },
  login: {
    id: 'app.components.LoginForm.login',
    defaultMessage: 'Sign in',
  },
  clear: {
    id: 'app.components.LoginForm.clear',
    defaultMessage: 'Clear',
  },
  required: {
    id: 'app.components.LoginForm.required',
    defaultMessage: 'Required.',
  },
  min5char: {
    id: 'app.components.LoginForm.min5char',
    defaultMessage: 'At least 5 characters.',
  },
  min8char: {
    id: 'app.components.LoginForm.min8char',
    defaultMessage: 'At least 8 characters.',
  },
  alphanumericDash: {
    id: 'app.components.LoginForm.alphanumericDash',
    defaultMessage: 'Number, alphabet, or dash only.',
  },
});
