import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import {
  withStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from 'material-ui';
import { Delete } from 'material-ui-icons';
import { TextField } from 'redux-form-material-ui';
import { Field, reduxForm, propTypes } from 'redux-form/immutable';

import messages from './messages';

const styles = (theme) => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class LoginPage extends React.PureComponent {
  required = (value) => {
    if (value) return undefined;
    return this.props.intl.formatMessage(messages.required);
  }

  min5char = (value) => {
    if (value.length >= 5) return undefined;
    return this.props.intl.formatMessage(messages.min5char);
  }

  min8char = (value) => {
    if (value.length >= 8) return undefined;
    return this.props.intl.formatMessage(messages.min8char);
  }

  alphanumericDash = (value) => {
    if (/^[-a-zA-Z0-9]*$/.test(value)) return undefined;
    return this.props.intl.formatMessage(messages.alphanumericDash);
  }

  render() {
    const { intl, classes } = this.props;
    const {
      handleSubmit,
      pristine,
      submitting,
    } = this.props;

    return (
      <Dialog open>
        <form onSubmit={handleSubmit(this.props.onSubmitLoginAction)}>
          <DialogTitle>
            <FormattedMessage {...messages.header} />
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <FormattedMessage {...messages.description} />
            </DialogContentText>
            <div>
              <Field
                name="username"
                type="text"
                component={TextField}
                autoFocus
                margin="dense"
                label={intl.formatMessage(messages.username)}
                helperText={intl.formatMessage(messages.usernameHelper)}
                fullWidth
                validate={[this.required, this.alphanumericDash, this.min5char]}
              />
            </div>
            <div>
              <Field
                name="password"
                type="password"
                component={TextField}
                label={intl.formatMessage(messages.password)}
                helperText={intl.formatMessage(messages.passwordHelper)}
                fullWidth
                validate={[this.required, this.min8char]}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              disabled={pristine || submitting}
              onClick={this.props.reset}
            >
              <FormattedMessage {...messages.clear} />
              <Delete className={classes.rightIcon} />
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={submitting}
            >
              <FormattedMessage {...messages.login} />
            </Button>
            <Button
              color="primary"
              disabled={submitting}
              onClick={this.props.onSubmitRegisterAction}
            >
              <FormattedMessage {...messages.register} />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

LoginPage.propTypes = {
  ...propTypes,
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  classes: PropTypes.object.isRequired,
  onSubmitLoginAction: PropTypes.func.isRequired,
  onSubmitRegisterAction: PropTypes.func.isRequired,
};

export const styledLoginPage = withStyles(styles, { withTheme: true })(LoginPage);

export default compose(
  reduxForm({ form: 'loginPage' }),
  injectIntl,
)(styledLoginPage);
