import { defineMessages } from 'react-intl';
import messages from 'utils/messages';

export default {
  ...messages,
  ...defineMessages({
    export: {
      id: 'app.components.EditVotersPage.export',
      defaultMessage: 'Export',
    },
  }),
};
