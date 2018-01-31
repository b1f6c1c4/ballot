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
  error_unknown: {
    id: 'app.error.unknown',
    defaultMessage: 'Unknown error happened.',
  },
  error_uath: {
    id: 'app.error.uath',
    defaultMessage: 'Unauthorzied.',
  },
  error_ntfd: {
    id: 'app.error.ntfd',
    defaultMessage: 'Not found.',
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
  error_stna: {
    id: 'app.error.stna',
    defaultMessage: 'Ballot status incorrect.',
  },
  fieldType_StringField: {
    id: 'app.fieldType.StringField',
    defaultMessage: 'String',
  },
  fieldType_EnumField: {
    id: 'app.fieldType.EnumField',
    defaultMessage: 'Enum',
  },
});
