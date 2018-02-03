import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import {
  withStyles,
  Typography,
  Button,
  Paper,
} from 'material-ui';
import { reduxForm, propTypes } from 'redux-form/immutable';
import PasswordField from 'components/PasswordField';
import ClearButton from 'components/ClearButton';
import LoadingButton from 'components/LoadingButton';
import ResultIndicator from 'components/ResultIndicator';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing.unit,
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    padding: theme.spacing.unit,
    overflowX: 'auto',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

class ChangePasswordPage extends React.PureComponent {
  handlePassword = (vals) => this.props.onPassword({
    oldPassword: vals.get('oldPassword'),
    newPassword: vals.get('newPassword'),
  });

  render() {
    const {
      classes,
      reset,
      handleSubmit,
      isLoading,
    } = this.props;

    return (
      <div className={classes.container}>
        <Typography type="display2">
          <FormattedMessage {...messages.header} />
        </Typography>
        <Paper className={classes.root}>
          <form onSubmit={handleSubmit(this.handlePassword)}>
            <div>
              <PasswordField
                label={messages.oldPassword}
                name="oldPassword"
                fullWidth
              />
              <PasswordField
                label={messages.newPassword}
                name="newPassword"
                fullWidth
              />
              <ResultIndicator error={this.props.error} />
            </div>
            <div className={classes.actions}>
              <ClearButton {...{ reset, isLoading }} />
              <LoadingButton {...{ isLoading }}>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isLoading}
                >
                  <FormattedMessage {...messages.change} />
                </Button>
              </LoadingButton>
            </div>
          </form>
        </Paper>
      </div>
    );
  }
}

ChangePasswordPage.propTypes = {
  ...propTypes,
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  classes: PropTypes.object.isRequired,
  onPassword: PropTypes.func.isRequired,
};

export const styledChangePasswordPage = withStyles(styles)(ChangePasswordPage);

export default compose(
  reduxForm({ form: 'passwordForm' }),
  injectIntl,
)(styledChangePasswordPage);
