import { defineMessages } from 'react-intl';
import messages from 'messages';

export default {
  ...messages,
  ...defineMessages({
    label: {
      id: 'app.components.UsernameField.label',
      defaultMessage: 'Username',
    },
    helperText: {
      id: 'app.components.UsernameField.helperText',
      defaultMessage: '5+ alphanumeric or dash chars.',
    },
  }),
};
