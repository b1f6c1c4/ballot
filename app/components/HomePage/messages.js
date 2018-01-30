import { defineMessages } from 'react-intl';
import messages from 'messages';

export default {
  ...messages,
  ...defineMessages({
    noCredential: {
      id: 'app.components.HomePage.noCredential',
      defaultMessage: 'Please login.',
    },
    header: {
      id: 'app.components.HomePage.header',
      defaultMessage: 'Control panel',
    },
    create: {
      id: 'app.components.HomePage.create',
      defaultMessage: 'Create',
    },
    refresh: {
      id: 'app.components.HomePage.refresh',
      defaultMessage: 'Refresh',
    },
  }),
};
