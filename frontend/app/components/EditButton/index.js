import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  Button,
} from 'material-ui';
import { Edit } from 'material-ui-icons';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class EditButton extends React.PureComponent {
  render() {
    const {
      classes,
      isLoading,
      ...other
    } = this.props;

    return (
      <Button
        {...other}
        color="primary"
        disabled={isLoading}
      >
        <FormattedMessage {...messages.text} />
        <Edit className={classes.rightIcon} />
      </Button>
    );
  }
}

EditButton.propTypes = {
  onClick: PropTypes.func,
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};

EditButton.defaultProps = {
  isLoading: false,
};

export const styledEditButton = withStyles(styles)(EditButton);

export default styledEditButton;
