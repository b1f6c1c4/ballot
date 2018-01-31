import { defineMessages } from 'react-intl';
import messages from 'messages';

export default {
  ...messages,
  ...defineMessages({
    header: {
      id: 'app.components.EditVotersPage.header',
      defaultMessage: 'This is the EditVotersPage component!',
    },
  }),
};
