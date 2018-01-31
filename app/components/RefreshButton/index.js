import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  Button,
} from 'material-ui';
import { Refresh } from 'material-ui-icons';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class RefreshButton extends React.PureComponent {
  render() {
    const {
      classes,
      onClick,
      isLoading,
      ...other
    } = this.props;

    return (
      <Button
        {...other}
        color="primary"
        disabled={isLoading}
        onClick={onClick}
      >
        <FormattedMessage {...messages.text} />
        <Refresh className={classes.rightIcon} />
      </Button>
    );
  }
}

RefreshButton.propTypes = {
  onClick: PropTypes.func,
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export const styledRefreshButton = withStyles(styles)(RefreshButton);

export default styledRefreshButton;
