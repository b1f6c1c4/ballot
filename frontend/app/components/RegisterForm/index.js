import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import {
  withStyles,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from 'material-ui';
import { reduxForm, propTypes } from 'redux-form/immutable';
import UsernameField from 'components/UsernameField';
import PasswordField from 'components/PasswordField';
import ClearButton from 'components/ClearButton';
import LoadingButton from 'components/LoadingButton';
import ResultIndicator from 'components/ResultIndicator';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
});

class RegisterForm extends React.PureComponent {
  handleRegister = (vals) => this.props.onRegister({
    username: vals.get('username'),
    password: vals.get('password'),
  });

  render() {
    const {
      error,
      reset,
      handleSubmit,
      isLoading,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleRegister)}>
        <DialogTitle>
          <FormattedMessage {...messages.header} />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage {...messages.description} />
          </DialogContentText>
          <div>
            <UsernameField name="username" fullWidth />
          </div>
          <div>
            <PasswordField name="password" fullWidth />
          </div>
          <ResultIndicator {...{ error }} />
        </DialogContent>
        <DialogActions>
          <ClearButton {...{ reset, isLoading }} />
          <LoadingButton {...{ isLoading }}>
            <Button
              type="submit"
              variant="raised"
              color="primary"
              disabled={this.props.isLoading}
            >
              <FormattedMessage {...messages.register} />
            </Button>
          </LoadingButton>
        </DialogActions>
      </form>
    );
  }
}

RegisterForm.propTypes = {
  ...propTypes,
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  classes: PropTypes.object.isRequired,
  onRegister: PropTypes.func.isRequired,
};

export const styledRegisterForm = withStyles(styles)(RegisterForm);

export default compose(
  reduxForm({ form: 'registerForm' }),
  injectIntl,
)(styledRegisterForm);
