import { defineMessages } from 'react-intl';
import messages from 'messages';

export default {
  ...messages,
  ...defineMessages({
    registered: {
      id: 'app.components.VoterCard.registered',
      defaultMessage: 'Registered',
    },
    unregistered: {
      id: 'app.components.VoterCard.unregistered',
      defaultMessage: 'Not registered',
    },
    iCode: {
      id: 'app.components.VoterCard.iCode',
      defaultMessage: 'Invitation Code',
    },
    publicKey: {
      id: 'app.components.VoterCard.publicKey',
      defaultMessage: 'Public Key',
    },
  }),
};
