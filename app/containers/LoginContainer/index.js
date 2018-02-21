import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import LoginPage from 'components/LoginPage';

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
  onLogin: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
  onChangeActiveIdAction: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    onLogin: (param) => dispatch(loginContainerActions.loginRequest(param)),
    onRegister: (param) => dispatch(loginContainerActions.registerRequest(param)),
    onChangeActiveIdAction: (value) => dispatch(loginContainerActions.changeActiveId(value)),
  };
}

const mapStateToProps = createStructuredSelector({
  activeId: (state) => state.getIn(['loginContainer', 'activeId']),
  isLoading: (state) => state.getIn(['loginContainer', 'isLoading']),
});

export default compose(
  injectSaga({ key: 'loginContainer', saga: sagas }),
  injectReducer({ key: 'loginContainer', reducer }),
  connect(mapStateToProps, mapDispatchToProps),
)(LoginContainer);
