import { defineMessages } from 'react-intl';
import messages from 'utils/messages';

export default {
  ...messages,
  ...defineMessages({
    header: {
      id: 'app.components.EditFieldsPage.header',
      defaultMessage: 'This is the EditFieldsPage component!',
    },
  }),
};
