import { defineMessages } from 'react-intl';

export default defineMessages({
  login: {
    id: 'app.general.login',
    defaultMessage: 'Sign in',
  },
  register: {
    id: 'app.general.register',
    defaultMessage: 'Sign up',
  },
  // Validation
  required: {
    id: 'app.validation.required',
    defaultMessage: 'Required.',
  },
  minChar: {
    id: 'app.validation.minChar',
    defaultMessage: 'At least {m} character(s).',
  },
  alphanumericDash: {
    id: 'app.validation.alphanumericDash',
    defaultMessage: 'Number, alphabet, or dash only.',
  },
  // Error
  errorUnknown: {
    id: 'app.error.unknown',
    defaultMessage: 'Unknown error happened.',
  },
  error_netw: {
    id: 'app.error.netw',
    defaultMessage: 'Network is bad.',
  },
  error_unex: {
    id: 'app.error.unex',
    defaultMessage: 'Username exists.',
  },
  error_wgup: {
    id: 'app.error.wgup',
    defaultMessage: 'Username and/or password incorrect.',
  },
});
