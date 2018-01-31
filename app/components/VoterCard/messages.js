import { defineMessages } from 'react-intl';
import messages from 'messages';

export default {
  ...messages,
  ...defineMessages({
    header: {
      id: 'app.components.VoterCard.header',
      defaultMessage: 'This is the VoterCard component!',
    },
  }),
};
