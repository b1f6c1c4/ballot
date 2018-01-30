import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import injectSaga from 'utils/injectSaga';

import {
  makeSelectGlobalContainerListBallots,
} from './selectors';
import * as globalContainerActions from './actions';
import sagas from './sagas';

export class GlobalContainer extends React.PureComponent {
  render() {
    return (
      <div {...this.props} />
    );
  }
}

GlobalContainer.propTypes = {
  isDrawerOpen: PropTypes.bool.isRequired,
  listBallots: PropTypes.array.isRequired,
  onOpenDrawerAction: PropTypes.func.isRequired,
  onCloseDrawerAction: PropTypes.func.isRequired,
  onOpenAccountAction: PropTypes.func.isRequired,
  onCloseAccountAction: PropTypes.func.isRequired,
  onLoginAction: PropTypes.func.isRequired,
  onLogoutAction: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onOpenDrawerAction: () => dispatch(globalContainerActions.openDrawer()),
    onCloseDrawerAction: () => dispatch(globalContainerActions.closeDrawer()),
    onOpenAccountAction: () => dispatch(globalContainerActions.openAccount()),
    onCloseAccountAction: () => dispatch(globalContainerActions.closeAccount()),
    onLoginAction: () => dispatch(globalContainerActions.login()),
    onLogoutAction: () => dispatch(globalContainerActions.logout()),
  };
}

const mapStateToProps = createStructuredSelector({
  isDrawerOpen: (state) => state.getIn(['globalContainer', 'isDrawerOpen']),
  listBallots: makeSelectGlobalContainerListBallots(),
});

export default compose(
  injectSaga({ key: 'loginContainer', saga: sagas }),
  connect(mapStateToProps, mapDispatchToProps),
)(GlobalContainer);
