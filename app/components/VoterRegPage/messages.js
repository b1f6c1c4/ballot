import { defineMessages } from 'react-intl';
import messages from 'utils/messages';

export default {
  ...messages,
  ...defineMessages({
    header: {
      id: 'app.components.VoterRegPage.header',
      defaultMessage: 'Register as voter',
    },
    register: {
      id: 'app.components.VoterRegPage.register',
      defaultMessage: 'Register',
    },
    commentLabel: {
      id: 'app.components.VoterRegPage.commentLabel',
      defaultMessage: 'Comment',
    },
    commentHelperText: {
      id: 'app.components.VoterRegPage.commentHelperText',
      defaultMessage: 'Optional',
    },
  }),
};
