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
  Typography,
} from 'material-ui';
import green from 'material-ui/colors/green';
import { Delete } from 'material-ui-icons';
import { reduxForm, propTypes } from 'redux-form/immutable';
import UsernameField from 'components/UsernameField';
import PasswordField from 'components/PasswordField';

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
  resultWrapper: {
    textAlign: 'center',
  },
});

class RegisterForm extends React.PureComponent {
  formatErrors = (error) => {
    if (!error) return null;

    const arr = [];
    let flag = true;

    if (!error.codes) {
      flag = false;
      arr.push(<FormattedMessage {...messages.unknownError} />);
    } else {
      error.codes.forEach((o) => {
        const idx = `error_${o}`;
        if (messages[idx]) {
          arr.push(<FormattedMessage {...messages[idx]} />);
        } else {
          flag = false;
        }
      });
    }
    if (!flag) {
      arr.push(error.message);
    }

    return arr.filter((a) => a !== null).map((a) => (
      <Typography color="error">
        {a}
      </Typography>
    ));
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { intl, classes } = this.props;
    const {
      error,
      handleSubmit,
      pristine,
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
            <UsernameField name="username" autoFocus fullWidth />
          </div>
          <div>
            <PasswordField name="password" fullWidth />
          </div>
          <div className={classes.resultWrapper}>
            {this.formatErrors(error)}
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
              <FormattedMessage {...messages.register} />
            </Button>
            {this.props.isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
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
