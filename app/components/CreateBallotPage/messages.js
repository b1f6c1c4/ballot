import { defineMessages } from 'react-intl';
import messages from 'messages';

export default {
  ...messages,
  ...defineMessages({
    header: {
      id: 'app.components.CreateBallotPage.header',
      defaultMessage: 'Create Ballot',
    },
    create: {
      id: 'app.components.CreateBallotPage.create',
      defaultMessage: 'Create',
    },
    nameLabel: {
      id: 'app.components.CreateBallotPage.nameLabel',
      defaultMessage: 'Name',
    },
    nameHelperText: {
      id: 'app.components.CreateBallotPage.nameHelperText',
      defaultMessage: '1+ alphanumeric or dash char.',
    },
  }),
};
