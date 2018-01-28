import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import { Field, reduxForm, propTypes } from 'redux-form/immutable';

import {
  withStyles,
  Button,
} from 'material-ui';
import {
  TextField,
} from 'redux-form-material-ui';

import * as loginPageActions from './actions';
import reducer from './reducer';
import sagas from './sagas';
import messages from './messages';

const styles = (theme) => ({
  content: {
    backgroundColor: theme.palette.background.default,
  },
});

class LoginContainer extends React.PureComponent {
  render() {
    const { classes } = this.props;
    const {
      handleSubmit,
      pristine,
      submitting,
    } = this.props;

    return (
      <div className={classes.content}>
        <FormattedMessage {...messages.header} />
        <p>{this.props.isLoading.toString()}</p>
        <form onSubmit={handleSubmit(this.props.onSubmitLoginAction)}>
          <div><Field name="username" component={TextField} type="text" /></div>
          <div><Field name="password" component={TextField} type="password" /></div>
          <button type="submit" disabled={submitting}>SubmitLoginAction</button>
          <Button disabled={pristine || submitting} onClick={this.reset}>Clear</Button>
        </form>
      </div>
    );
  }
}

LoginContainer.propTypes = {
  ...propTypes,
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSubmitLoginAction: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSubmitLoginAction: () => dispatch(loginPageActions.submitLogin()),
  };
}

const mapStateToProps = createStructuredSelector({
  isLoading: (state) => state.get('loginContainer').get('isLoading'),
});

export const styledLoginContainer = withStyles(styles, { withTheme: true })(LoginContainer);

export default compose(
  injectSaga({ key: 'loginContainer', saga: sagas }),
  injectReducer({ key: 'loginContainer', reducer }),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({ form: 'login' }),
)(styledLoginContainer);
