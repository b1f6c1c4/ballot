import { defineMessages } from 'react-intl';
import messages from 'utils/messages';

export default {
  ...messages,
  ...defineMessages({
    profile: {
      id: 'app.components.GlobalDrawer.profile',
      defaultMessage: 'Home',
    },
  }),
};
