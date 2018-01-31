import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
} from 'material-ui';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
});

class VoterCard extends React.PureComponent {
  render() {
    // eslint-disable-next-line no-unused-vars
    const { classes } = this.props;

    return (
      <div>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

VoterCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export const styledVoterCard = withStyles(styles)(VoterCard);

export default styledVoterCard;
