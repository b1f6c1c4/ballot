import { defineMessages } from 'react-intl';
import messages from 'messages';

export default {
  ...messages,
  ...defineMessages({
    label: {
      id: 'app.components.PasswordField.label',
      defaultMessage: 'Password',
    },
    helperText: {
      id: 'app.components.PasswordField.helperText',
      defaultMessage: '8+ chars.',
    },
  }),
};
