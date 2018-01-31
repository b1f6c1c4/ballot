import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  Button,
} from 'material-ui';
import { Delete } from 'material-ui-icons';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class ClearButton extends React.PureComponent {
  render() {
    const {
      classes,
      reset,
      isLoading,
      ...other
    } = this.props;

    return (
      <Button
        {...other}
        color="secondary"
        disabled={isLoading}
        onClick={reset}
      >
        <FormattedMessage {...messages.text} />
        <Delete className={classes.rightIcon} />
      </Button>
    );
  }
}

ClearButton.propTypes = {
  reset: PropTypes.func,
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export const styledClearButton = withStyles(styles)(ClearButton);

export default styledClearButton;
