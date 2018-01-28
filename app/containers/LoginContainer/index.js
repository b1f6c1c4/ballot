import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import LoginPage from 'components/LoginPage/Loadable';

import * as loginContainerActions from './actions';
import reducer from './reducer';
import sagas from './sagas';

export class LoginContainer extends React.PureComponent {
  render() {
    return (
      <LoginPage {...this.props} />
    );
  }
}

LoginContainer.propTypes = {
  onSubmitLoginAction: PropTypes.func.isRequired,
  onSubmitRegisterAction: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSubmitLoginAction: () => dispatch(loginContainerActions.submitLogin()),
    onSubmitRegisterAction: () => dispatch(loginContainerActions.submitRegister()),
  };
}

const mapStateToProps = createStructuredSelector({
  data: (state) => state.getIn(['loginContainer', 'data']),
});

export default compose(
  injectSaga({ key: 'loginContainer', saga: sagas }),
  injectReducer({ key: 'loginContainer', reducer }),
  connect(mapStateToProps, mapDispatchToProps),
)(LoginContainer);
