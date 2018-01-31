import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
} from 'material-ui';
import VoterCard from 'components/VoterCard/Loadable';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
});

class EditVotersPage extends React.PureComponent {
  render() {
    // eslint-disable-next-line no-unused-vars
    const { classes } = this.props;

    return (
      <div>
        <FormattedMessage {...messages.header} />
        <VoterCard />
      </div>
    );
  }
}

EditVotersPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export const styledEditVotersPage = withStyles(styles)(EditVotersPage);

export default styledEditVotersPage;
