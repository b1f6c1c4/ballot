import { defineMessages } from 'react-intl';
import messages from 'messages';

export default {
  ...messages,
  ...defineMessages({
    text: {
      id: 'app.components.ClearButton.text',
      defaultMessage: 'Clear',
    },
  }),
};
