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
  CircularProgress,
} from 'material-ui';
import green from 'material-ui/colors/green';
import { Delete } from 'material-ui-icons';
import { TextField } from 'redux-form-material-ui';
import { Field, reduxForm, propTypes } from 'redux-form/immutable';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  buttonWrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class LoginForm extends React.PureComponent {
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
    // eslint-disable-next-line no-unused-vars
    const { intl, classes } = this.props;
    const {
      handleSubmit,
      pristine,
    } = this.props;

    return (
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
            disabled={pristine || this.props.isLoading}
            onClick={this.props.reset}
          >
            <FormattedMessage {...messages.clear} />
            <Delete className={classes.rightIcon} />
          </Button>
          <div className={classes.buttonWrapper}>
            <Button
              type="submit"
              color="primary"
              disabled={this.props.isLoading}
            >
              <FormattedMessage {...messages.login} />
            </Button>
            {this.props.isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </DialogActions>
      </form>
    );
  }
}

LoginForm.propTypes = {
  ...propTypes,
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  classes: PropTypes.object.isRequired,
  onSubmitLoginAction: PropTypes.func.isRequired,
};

export const styledLoginForm = withStyles(styles)(LoginForm);

export default compose(
  reduxForm({ form: 'loginForm' }),
  injectIntl,
)(styledLoginForm);
