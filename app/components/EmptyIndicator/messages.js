import { defineMessages } from 'react-intl';
import messages from 'messages';

export default {
  ...messages,
  ...defineMessages({
    empty: {
      id: 'app.components.EmptyIndicator.empty',
      defaultMessage: 'Empty',
    },
  }),
};
