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
    dropTitle: {
      id: 'app.components.EditFieldsPage.dropTitle',
      defaultMessage: 'Are you sure',
    },
    dropDescription: {
      id: 'app.components.EditFieldsPage.dropDescription',
      defaultMessage: 'Drop?',
    },
    deleteTitle: {
      id: 'app.components.EditFieldsPage.deleteTitle',
      defaultMessage: 'Are you sure',
    },
    deleteDescription: {
      id: 'app.components.EditFieldsPage.deleteDescription',
      defaultMessage: 'Delete?',
    },
  }),
};