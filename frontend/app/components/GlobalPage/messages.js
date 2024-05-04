import { defineMessages } from 'react-intl';
import messages from 'utils/messages';

export default {
  ...messages,
  ...defineMessages({
    extendTitle: {
      id: 'app.components.GlobalPage.extendTitle',
      defaultMessage: 'JWT',
    },
    extendDescription: {
      id: 'app.components.GlobalPage.extendDescription',
      defaultMessage: 'Extend?',
    },
    extendYes: {
      id: 'app.components.GlobalPage.extendYes',
      defaultMessage: 'Yes',
    },
    extendNo: {
      id: 'app.components.GlobalPage.extendNo',
      defaultMessage: 'No',
    },
  }),
};
