import { defineMessages } from 'react-intl';
import messages from 'utils/messages';

export default {
  ...messages,
  ...defineMessages({
    drop: {
      id: 'app.components.EditFieldsPage.drop',
      defaultMessage: 'Drop',
    },
    save: {
      id: 'app.components.EditFieldsPage.save',
      defaultMessage: 'Save',
    },
    create: {
      id: 'app.components.EditFieldsPage.create',
      defaultMessage: 'Create',
    },
  }),
};
