import { defineMessages } from 'react-intl';
import messages from 'messages';

export default {
  ...messages,
  ...defineMessages({
    bId: {
      id: 'app.components.BallotMeta.bId',
      defaultMessage: 'ID: ',
    },
  }),
};
