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
import UsernameField from 'components/UsernameField/Loadable';
import PasswordField from 'components/PasswordField/Loadable';
import ClearButton from 'components/ClearButton/Loadable';
import LoadingButton from 'components/LoadingButton/Loadable';
import ResultIndicator from 'components/ResultIndicator/Loadable';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
});

class RegisterForm extends React.PureComponent {
  render() {
    const {
      error,
      reset,
      handleSubmit,
      isLoading,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(this.props.onSubmitRegisterAction)}>
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
              raised
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
  onSubmitRegisterAction: PropTypes.func.isRequired,
};

export const styledRegisterForm = withStyles(styles)(RegisterForm);

export default compose(
  reduxForm({ form: 'registerForm' }),
  injectIntl,
)(styledRegisterForm);
