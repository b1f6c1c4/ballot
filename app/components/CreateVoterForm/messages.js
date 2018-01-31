import { defineMessages } from 'react-intl';
import messages from 'messages';

export default {
  ...messages,
  ...defineMessages({
    header: {
      id: 'app.components.CreateVoterForm.header',
      defaultMessage: 'Create Voter',
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
      defaultMessage: 'Not null.',
    },
  }),
};
