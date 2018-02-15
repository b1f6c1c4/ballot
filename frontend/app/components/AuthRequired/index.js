import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  Typography,
} from 'material-ui';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
});

class AuthRequired extends React.PureComponent {
  render() {
    // eslint-disable-next-line no-unused-vars
    const { classes } = this.props;

    if (!this.props.hasCredential) {
      return (
        <Typography variant="display2">
          <FormattedMessage {...messages.header} />
        </Typography>
      );
    }

    return this.props.children;
  }
}

AuthRequired.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element,
  hasCredential: PropTypes.bool.isRequired,
};

export const styledAuthRequired = withStyles(styles)(AuthRequired);

export default styledAuthRequired;
