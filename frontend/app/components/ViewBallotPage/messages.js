import { defineMessages } from 'react-intl';
import messages from 'utils/messages';

export default {
  ...messages,
  ...defineMessages({
    fields: {
      id: 'app.components.ViewBallotPage.fields',
      defaultMessage: 'Fields',
    },
    voters: {
      id: 'app.components.ViewBallotPage.voters',
      defaultMessage: 'Voters',
    },
    stats: {
      id: 'app.components.ViewBallotPage.stats',
      defaultMessage: 'Statistics',
    },
    registered: {
      id: 'app.components.ViewBallotPage.registered',
      defaultMessage: 'Registered',
    },
    unregistered: {
      id: 'app.components.ViewBallotPage.unregistered',
      defaultMessage: 'Not registered',
    },
  }),
};
